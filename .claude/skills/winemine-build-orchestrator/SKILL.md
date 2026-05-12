---
name: winemine-build-orchestrator
description: winemine 키스크린의 전체 개발 워크플로우를 조율하는 오케스트레이터. WINEMINE_KEYSCREEN_SPEC.md 기반으로 7명 에이전트(scaffolder, infrastructure-builder, mock-data-architect, tasting-note-engineer, page-builder, wine-detail-specialist, qa-integration-checker)를 하이브리드 모드(서브→팀→팀→서브)로 운영. 다음 키워드/상황에서 반드시 트리거: 'winemine 키스크린 개발', 'WINEMINE_KEYSCREEN_SPEC 기반 구축', '키스크린 시안 만들어', '하네스 실행', '앱 프로토타입 구현', '와인 앱 만들어'. 후속 작업으로 '키스크린 다시 빌드', '특정 페이지만 다시', '셀러 페이지 수정', '와인 상세 개선', '온보딩 구현해줘', 'QA 다시 돌려'도 트리거. 마일스톤 단위로 사용자에게 보고하고 진행 승인 받음.
---

# winemine-build-orchestrator — 키스크린 개발 오케스트레이터

## 목적

WINEMINE_KEYSCREEN_SPEC.md (2462줄) 기반으로 winemine 키스크린 시안 앱을 단계적으로 구축. 7명 에이전트를 하이브리드 실행 모드로 운영, 4 Phase로 진행.

## 실행 모드 (하이브리드)

| Phase | 모드 | 에이전트 | 산출물 |
|---|---|---|---|
| **A. Scaffold** | 서브 단일 | scaffolder | 빌드 가능한 Next.js 골격, `_workspace/A_scaffolder_report.md` |
| **B. Foundation** (병렬) | 팀 | infrastructure-builder + mock-data-architect | DeviceFrame/Nav/Context + mock fixture 16종, `_workspace/B_*.md` |
| **C. Feature build** (병렬) | 팀 | tasting-note-engineer + page-builder + wine-detail-specialist | 22 라우트 + 13 테이스팅 컴포넌트, `_workspace/C_*.md` |
| **D. Verify** | 서브 단일 | qa-integration-checker | `_workspace/D_qa_report.md` |

## Phase 0 — 컨텍스트 확인 (가장 먼저)

워크플로우 시작 시 `_workspace/` 존재 여부와 사용자 의도를 확인하여 실행 모드 결정:

```
1. _workspace/ 미존재 + 사용자 첫 요청
   → 초기 실행: Phase A부터 순차 실행
2. _workspace/ 존재 + 사용자가 "부분 수정" 요청
   → 부분 재실행: 해당 에이전트만 재호출 (예: "셀러 페이지만 수정" → page-builder)
3. _workspace/ 존재 + 사용자가 "전체 다시" 명시
   → 새 실행: 기존 _workspace/를 _workspace_prev_{date}/로 이동 후 Phase A부터
4. _workspace/A_*.md만 존재 + 다음 Phase 요청
   → Phase B부터 시작
```

## Phase A — Scaffold (서브 모드)

```
1. winemine-scaffold 스킬 호출 → scaffolder 에이전트
2. Agent 도구: subagent_type="scaffolder", model="opus"
3. 산출물: _workspace/A_scaffolder_report.md + Next.js 골격
```

**마일스톤 보고:** Phase A 완료 후 사용자에게 보고:
> "Scaffold 완료. `npm run dev`로 http://localhost:3000에 winemine 로고 떴는지 확인해 줘. 다음은 Foundation Phase (DeviceFrame + mock 데이터 병렬)인데 진행?"

승인 받으면 Phase B로.

## Phase B — Foundation (팀 모드, 병렬)

```
1. TeamCreate(team_name="winemine-foundation", members=["infrastructure-builder", "mock-data-architect"])
2. TaskCreate 작업:
   - Task B1: DeviceFrame + Nav + Context (담당: infrastructure-builder)
     → winemine-foundation-shell 스킬 호출
   - Task B2: 16 fixture + lib 모듈 (담당: mock-data-architect)
     → winemine-mock-fixtures 스킬 호출
3. 두 작업은 독립적이므로 dependencies 없음 (병렬 실행)
4. 두 에이전트는 SendMessage로 fixture 헬퍼 API 합의
5. 두 작업 완료 후 산출물: _workspace/B_infrastructure_report.md + B_mock_data_report.md
6. qa-integration-checker로 Foundation QA 1회 (옵션) — 카테고리 1, 2, 7 위주
```

**마일스톤 보고:** Phase B 완료 후:
> "Foundation 완료. DeviceFrame, BottomNav, 모드 컨텍스트, mock 데이터 60종 와인+28셀러+47노트 준비됨. 다음은 Feature build Phase (테이스팅 노트 + 일반 페이지 + 와인 상세 3개 병렬)인데 진행?"

## Phase C — Feature build (팀 모드, 병렬)

```
1. TeamCreate(team_name="winemine-features", members=["tasting-note-engineer", "page-builder", "wine-detail-specialist"])
2. TaskCreate:
   - Task C1: 9+4 tasting note 컴포넌트 + 2 컨테이너 (담당: tasting-note-engineer)
   - Task C2: 16 라우트 + i18n 매니징 + DemoControls/FeatureFlagPanel (담당: page-builder)
   - Task C3: 4 wine detail 라우트 + 4 복잡 카드 (담당: wine-detail-specialist)
3. 의존 관계:
   - C2는 C1의 i18n keys.json을 흡수 (SendMessage로 알림 받음)
   - C2는 C3의 i18n keys.json도 흡수
   - C2와 C3는 /wine/[id] 라우트 컨벤션 합의 (SendMessage)
4. SendMessage 패턴:
   - tasting-note-engineer → page-builder: "i18n keys.json export 완료"
   - wine-detail-specialist → page-builder: "i18n keys.json export 완료"
   - page-builder → wine-detail-specialist: "/wine/[id] 컨벤션 합의 — 표준화"
5. 마일스톤 체크포인트: 테이스팅 노트 완성 직후 (C1만 완료된 시점) Tasting note QA 옵션
6. 전체 완료 후 산출물: _workspace/C_*.md (3개)
```

**중간 마일스톤 보고:** C1 (테이스팅 노트) 완료 후:
> "테이스팅 노트 9+4 컴포넌트 + 작성 화면 완성. handover doc 시그니처 검증해도 좋고, 시각 확인하려면 /notes/new/write 진입해 봐. 다른 페이지(C2, C3)는 계속 진행 중."

**마일스톤 보고:** Phase C 완료 후:
> "Feature build 완료. 22 라우트 모두 클릭 가능, messages 양쪽 동기, 베타 피드백 7항목 반영. 마지막 QA Phase 진행?"

## Phase D — Verify (서브 모드)

```
1. winemine-qa-checks 스킬 호출 → qa-integration-checker
2. Agent 도구: subagent_type="qa-integration-checker", model="opus"
3. 8 카테고리 검증:
   - i18n 정합성
   - mock 데이터 정합성
   - 라우트 정합성
   - handover doc 컴포넌트 시그니처
   - 베타 피드백 반영
   - 컴포넌트 노출 규칙 (LevelPill+ReviewBadge)
   - 빌드/런타임
   - 모드 토글
4. 산출물: _workspace/D_qa_report.md
5. 실패 항목 있으면 → 담당 에이전트 재호출 → QA 재실행 (최대 3회 루프)
6. 모두 통과 또는 사용자 승인 시 종료
```

**마일스톤 보고:** Phase D 완료 후:
> "QA 통과. {N}건 자동 검증 + {M}건 수동 확인 필요. `_workspace/D_qa_report.md` 참조. 시안 검수 시작해도 됨."

## 데이터 전달 프로토콜

| 전략 | 사용 |
|---|---|
| **태스크 기반** (TaskCreate/Update) | Phase B/C 팀 모드 — 작업 의존성 추적 |
| **메시지 기반** (SendMessage) | i18n keys 전달, 라우트 컨벤션 합의, QA 실패 보고 |
| **파일 기반** (`_workspace/*.md` + `*.json`) | Phase 산출물, 후속 에이전트 입력 |
| **반환값 기반** (Agent 반환) | Phase A/D 서브 모드 종합 보고 |

### 파일 컨벤션

```
_workspace/
├── A_scaffolder_report.md
├── B_infrastructure_report.md
├── B_mock_data_report.md
├── C_tasting_note_report.md
├── C_tasting_note_i18n_keys.json
├── C_page_builder_report.md
├── C_wine_detail_report.md
├── C_wine_detail_i18n_keys.json
└── D_qa_report.md
```

`_workspace/`는 `.gitignore` 포함 — 시안 산출물이지 코드 아님.

## 에러 핸들링

1. **빌드 실패:** 해당 Phase 즉시 중단, 사용자 보고. 가능한 자동 복구는 1회 재시도 (peer-dep 문제 등). 재실패 시 사용자 개입.
2. **에이전트 사이 의존성 누락:** SendMessage로 즉시 보고. 예) C2가 C1의 i18n keys.json 없이 진행 → 차단, C1 완료 대기.
3. **QA 실패 루프:** 최대 3회. 3회 후에도 동일 실패면 사용자에게 결정 위임 ("이 항목은 수동 검수가 필요해 보임").
4. **충돌 데이터:** 삭제 X, 양쪽 보존 + 출처 병기. 예: tasting-note-engineer가 export한 i18n key와 page-builder가 별도로 만든 키가 겹치면 SendMessage로 합의.

## 후속 작업 패턴 (점진적 사용)

사용자 요청이 부분 수정인 경우:
- "셀러 페이지 카드 디자인 바꿔" → page-builder만 재호출 (winemine-page-routing 스킬)
- "AromaWheel 휠 색 조정" → tasting-note-engineer (winemine-tasting-components)
- "와인 60개를 더 늘려" → mock-data-architect (winemine-mock-fixtures)
- "QA 다시" → qa-integration-checker (winemine-qa-checks)

해당 에이전트의 재호출 시 행동(에이전트 정의 파일의 `## 재호출 시 행동` 섹션) 참조.

## 팀 크기 조정

- Phase B: 2명 — 의존성 최소, 병렬 효율 높음
- Phase C: 3명 — 권장 한계. 4명 이상은 조율 오버헤드 증가하므로 분리 안 함.

## 테스트 시나리오

### 정상 흐름

```
사용자: "WINEMINE_KEYSCREEN_SPEC.md 기반으로 키스크린 개발해줘"

1. 오케스트레이터 트리거 → Phase 0 컨텍스트 확인
2. _workspace/ 미존재 → 초기 실행
3. Phase A: scaffolder 호출 → 골격 완성
4. 마일스톤 보고 → 사용자 승인
5. Phase B: TeamCreate + 병렬 작업
6. 마일스톤 보고 → 사용자 승인
7. Phase C: TeamCreate + 3명 병렬, 중간 체크포인트
8. 마일스톤 보고
9. Phase D: QA, 실패 0 또는 사용자 승인
10. 종료: "시안 검수 시작해도 됨"
```

### 에러 흐름 (Phase B에서 mock-data-architect 빌드 실패)

```
1. TaskList로 진행 상황 확인 → mock-data-architect 작업 in_progress 유지
2. 보고서에 빌드 실패 메시지 발견
3. mock-data-architect 재호출 (정확한 오류 + 위치 전달)
4. 1회 자동 재시도, 재실패 시 사용자에게 보고
5. 사용자 결정 후 진행
```

### 부분 재실행 흐름

```
사용자: "셀러 페이지의 빈 상태 카피를 수정하고 싶어"

1. 오케스트레이터 트리거 → Phase 0
2. _workspace/ 존재 + 부분 수정 요청 → 부분 재실행 모드
3. 해당 에이전트(page-builder) 식별
4. winemine-page-routing 스킬 호출, 작업 범위 명시
5. 수정 후 i18n 키 갱신 → messages 양쪽 동기 확인
6. QA 재실행 (i18n 카테고리만)
7. 완료 보고
```
