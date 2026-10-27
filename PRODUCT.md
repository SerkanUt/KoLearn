# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

English speakers learning Korean. They read, translate and practice vocabulary in short sessions, mostly on a phone, with web as a secondary surface.

## Product Purpose

KoLearn (package and scheme name "Lingoistics") helps learners build Korean through real material instead of textbook drills. Success is a learner who returns daily, reads actual Korean news, saves what they translate, and keeps a streak.

## Positioning

Learning from authentic Naver News articles (international section), plus turning the learner's own vocabulary into a generated story, in one app with local history and streaks.

## Operating Context

- Four working areas under `app/(app)`: Home (greeting, stats, activity, news), Daily (news list and article detail), Story (vocabulary to story), Translate (16-language picker, history), plus Settings.
- Backend is a Flask API (`backend/`) backed by MongoDB; a scraper fills it from Naver News. The app reads `GET /news` and calls `POST /story`.
- Progress data (translations, saved stories, activity, settings) is stored on device via AsyncStorage.

## Capabilities and Constraints

- Expo / React Native (expo-router), one codebase for iOS, Android and web, with a responsive sidebar on wide screens.
- Light and dark mode follow the system setting.
- Story generation is a **stub** today (`POST /story` returns a trivial story). Do not present it as a working AI capability until it is wired up.
- Translation target set is 16 languages (see `constants/Languages.ts`); Korean is the focus language.
- Naming is unresolved: the app displays "KoLearn" while code and backend say "Lingoistics". Do not pick one in copy without asking.

## Evidence on Hand

- Logo at `assets/images/Logo.png`.
- No testimonials, user counts, pricing or store listing exist. Do not fabricate them.

## Product Principles

- Real Korean content over contrived exercises.
- Short, repeatable sessions that reward coming back daily.
- Progress is visible but never shaming.
- Only claim what works today; placeholders stay honest.
- Native-feeling on each phone OS; web follows, not leads.
