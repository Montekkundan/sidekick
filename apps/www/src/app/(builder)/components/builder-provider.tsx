"use client";

import * as React from "react";
import { nanoid } from "nanoid";

export type BuilderSession = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  jsx: string;
  states: BuilderState[];
  activeStateId: string;
  stateSchema: BuilderStateSchema;
};

export type BuilderState = {
  id: string;
  name: string;
  data: string;
};

export type BuilderStateSchema = {
  mode: "zod" | "json";
  zod: string;
  json: string;
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

export const DEFAULT_WIDGET_JSX = `<Card>
  <CardContent className="space-y-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground">
      Build an interface from shadcn UI components.
    </p>
    <Button>Continue</Button>
  </CardContent>
</Card>`;

export const DEFAULT_A2UI_DATA = `{
  "title": "Hello World"
}`;

export const DEFAULT_STATE_SCHEMA_ZOD = `import { z } from "zod";

const WidgetState = z.strictObject({
  title: z.string(),
});

export default WidgetState;`;

export const DEFAULT_STATE_SCHEMA_JSON = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    }
  },
  "required": [
    "title"
  ],
  "additionalProperties": false
}`;

const DEFAULT_STATE: BuilderState = {
  id: "default",
  name: "Default",
  data: DEFAULT_A2UI_DATA,
};

const DEFAULT_STATE_SCHEMA: BuilderStateSchema = {
  mode: "json",
  zod: DEFAULT_STATE_SCHEMA_ZOD,
  json: DEFAULT_STATE_SCHEMA_JSON,
};

const BuilderContext = React.createContext<BuilderContextValue | null>(null);

function buildSession(overrides: Partial<BuilderSession> = {}): BuilderSession {
  const now = Date.now();
  return {
    id: nanoid(),
    title: "Untitled chat",
    createdAt: now,
    updatedAt: now,
    jsx: DEFAULT_WIDGET_JSX,
    states: [DEFAULT_STATE],
    activeStateId: DEFAULT_STATE.id,
    stateSchema: { ...DEFAULT_STATE_SCHEMA },
    ...overrides,
  };
}

function normalizeSession(session: BuilderSession): BuilderSession {
  const jsx =
    session.jsx && typeof session.jsx === "string"
      ? session.jsx
      : DEFAULT_WIDGET_JSX;
  const states = session.states?.length
    ? session.states
    : [
        {
          id: "default",
          name: "Default",
          data:
            (session as unknown as { data?: string }).data ?? DEFAULT_A2UI_DATA,
        },
      ];
  const stateSchema = session.stateSchema
    ? {
        mode: session.stateSchema.mode ?? DEFAULT_STATE_SCHEMA.mode,
        zod: session.stateSchema.zod ?? DEFAULT_STATE_SCHEMA.zod,
        json: session.stateSchema.json ?? DEFAULT_STATE_SCHEMA.json,
      }
    : DEFAULT_STATE_SCHEMA;

  return {
    ...session,
    jsx,
    states,
    activeStateId: session.activeStateId ?? states[0]?.id ?? "default",
    stateSchema,
  };
}

function safeParseSessions(raw: string | null): BuilderSession[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as BuilderSession[];
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    return parsed.filter((session) => {
      if (typeof session?.id !== "string") return false;
      if (seen.has(session.id)) return false;
      seen.add(session.id);
      return true;
    }).map(normalizeSession);
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
    const storedSessions = safeParseSessions(
      localStorage.getItem(STORAGE_KEY)
    );
    const storedActive = localStorage.getItem(ACTIVE_SESSION_KEY);
    const initialSessions =
      storedSessions.length > 0 ? storedSessions : [buildSession()];
    const initialActive =
      storedActive &&
      initialSessions.some((session) => session.id === storedActive)
        ? storedActive
        : initialSessions[0]?.id ?? null;

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
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = React.useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider.");
  }
  return context;
}
