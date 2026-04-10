# Architectural Decision Records

## ADR-001: React Navigation for routing

**Status:** Accepted

**Context:** The app needs bottom-tab navigation with nested stack navigators for detail screens.

**Decision:** Use `@react-navigation/native` with `@react-navigation/bottom-tabs` and `@react-navigation/native-stack`.

**Rationale:** React Navigation is the most widely adopted routing library for React Native CLI apps. It supports typed navigation params, deep linking, and has first-class support for native stack transitions via `react-native-screens`.

---

## ADR-002: Zustand for state management

**Status:** Accepted

**Context:** The app needs a persisted watchlist store. Global state is limited to this single concern.

**Decision:** Use Zustand with the `persist` middleware backed by `@react-native-async-storage/async-storage`.

**Rationale:** Zustand has minimal boilerplate compared to Redux. For a single-store use case (watchlist), it avoids unnecessary complexity while providing built-in persistence middleware.

---

## ADR-003: Axios as HTTP client

**Status:** Accepted

**Context:** The app fetches data from the TMDB REST API (v3). All calls need an API key injected as a query parameter.

**Decision:** Use a single Axios instance (`src/api/client.ts`) with a request interceptor that appends the API key from `react-native-config`.

**Rationale:** Axios provides interceptors, automatic JSON parsing, configurable timeouts, and a clean API surface. Centralising the instance enforces the project rule that no other file imports Axios directly.

---

## ADR-004: TMDB API as data source

**Status:** Accepted

**Context:** The app is a content discovery and watchlist tool for movies.

**Decision:** Use The Movie Database (TMDB) API v3 for trending, top-rated, search, and movie detail endpoints.

**Rationale:** TMDB offers a free tier with generous rate limits, comprehensive movie metadata, and high-quality poster/backdrop images.

---

## ADR-005: react-native-config for environment variables

**Status:** Accepted

**Context:** API keys must not be committed to the repository.

**Decision:** Use `react-native-config` to inject values from `.env` files at build time. A `.env.example` with placeholder values is committed; `.env` is gitignored.

**Rationale:** `react-native-config` is the standard approach for RN CLI projects. It injects env values into both JS and native (Android/iOS) layers.
