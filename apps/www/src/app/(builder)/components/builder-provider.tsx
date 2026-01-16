"use client";

import { nanoid } from "nanoid";
import React from "react";

export type BuilderSession = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  uiTree: string;
};

type BuilderContextValue = {
  sessions: BuilderSession[];
  activeSessionId: string | null;
  isReady: boolean;
  createSession: (overrides?: Partial<BuilderSession>) => BuilderSession;
  deleteSession: (id: string) => BuilderSession | null;
  setActiveSessionId: (id: string) => void;
  updateSession: (id: string, updates: Partial<BuilderSession>) => void;
};

const STORAGE_KEY = "sidekick.builder.sessions";
const ACTIVE_SESSION_KEY = "sidekick.builder.active";

export const DEFAULT_WIDGET_UITREE = `{
  "root": "root",
  "elements": {
    "root": {
      "key": "root",
      "type": "Card",
      "props": {
        "className": "w-full"
      },
      "children": ["content"],
      "parentKey": null
    },
    "content": {
      "key": "content",
      "type": "CardContent",
      "props": {
        "className": "space-y-4"
      },
      "children": ["title", "subtitle", "cta"],
      "parentKey": "root"
    },
    "title": {
      "key": "title",
      "type": "Text",
      "props": {
        "variant": "h3",
        "text": "Hello World"
      },
      "parentKey": "content"
    },
    "subtitle": {
      "key": "subtitle",
      "type": "Text",
      "props": {
        "text": "Build an interface from shadcn UI components.",
        "variant": "caption"
      },
      "parentKey": "content"
    },
    "cta": {
      "key": "cta",
      "type": "Button",
      "props": {
        "label": "Continue",
        "action": {
          "name": "toast",
          "params": {
            "title": "Clicked"
          }
        }
      },
      "parentKey": "content"
    }
  }
}`;

const BuilderContext = React.createContext<BuilderContextValue | null>(null);

function buildSession(overrides: Partial<BuilderSession> = {}): BuilderSession {
  const now = Date.now();
  return {
    id: nanoid(),
    title: "Untitled chat",
    createdAt: now,
    updatedAt: now,
    uiTree: DEFAULT_WIDGET_UITREE,
    ...overrides,
  };
}

function normalizeSession(session: BuilderSession): BuilderSession {
  // Legacy sessions stored JSX; we intentionally reset those to the default UI tree.
  let uiTree = DEFAULT_WIDGET_UITREE;
  if (typeof session.uiTree === "string" && session.uiTree.length > 0) {
    uiTree = session.uiTree;
  }

  return {
    ...session,
    uiTree,
  };
}

function safeParseSessions(raw: string | null): BuilderSession[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as BuilderSession[];
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    return parsed
      .filter((session) => {
        if (typeof session?.id !== "string") return false;
        if (seen.has(session.id)) return false;
        seen.add(session.id);
        return true;
      })
      .map(normalizeSession);
  } catch {
    return [];
  }
}

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = React.useState<BuilderSession[]>([]);
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(
    null
  );
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const storedSessions = safeParseSessions(localStorage.getItem(STORAGE_KEY));
    const storedActive = localStorage.getItem(ACTIVE_SESSION_KEY);
    const initialSessions =
      storedSessions.length > 0 ? storedSessions : [buildSession()];
    const initialActive =
      storedActive &&
      initialSessions.some((session) => session.id === storedActive)
        ? storedActive
        : (initialSessions[0]?.id ?? null);

    setSessions(initialSessions);
    setActiveSessionId(initialActive);
    setIsReady(true);
  }, []);

  React.useEffect(() => {
    // TODO: Replace localStorage persistence with DB storage once auth lands.
    if (!isReady) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      if (activeSessionId) {
        localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
      }
    } catch {
      // Ignore storage errors (private mode, quota, etc.)
    }
  }, [sessions, activeSessionId, isReady]);

  const createSession = React.useCallback(
    (overrides: Partial<BuilderSession> = {}) => {
      const session = buildSession(overrides);
      setSessions((prev) => [session, ...prev]);
      setActiveSessionId(session.id);
      return session;
    },
    []
  );

  const deleteSession = React.useCallback(
    (id: string) => {
      const remaining = sessions.filter((session) => session.id !== id);
      let nextSession: BuilderSession | null = null;
      if (remaining.length === 0) {
        nextSession = buildSession();
        setSessions([nextSession]);
      } else {
        setSessions(remaining);
        if (activeSessionId === id) {
          nextSession = remaining[0] ?? null;
        }
      }

      if (nextSession) {
        setActiveSessionId(nextSession.id);
      }

      return nextSession;
    },
    [sessions, activeSessionId]
  );

  const updateSession = React.useCallback(
    (id: string, updates: Partial<BuilderSession>) => {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === id
            ? {
                ...session,
                ...updates,
                updatedAt: Date.now(),
              }
            : session
        )
      );
    },
    []
  );

  const value = React.useMemo<BuilderContextValue>(
    () => ({
      sessions,
      activeSessionId,
      isReady,
      createSession,
      deleteSession,
      setActiveSessionId,
      updateSession,
    }),
    [
      sessions,
      activeSessionId,
      isReady,
      createSession,
      deleteSession,
      updateSession,
    ]
  );

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = React.useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider.");
  }
  return context;
}
