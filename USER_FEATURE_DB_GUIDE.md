# 쩝쩝대 사용자 기능·DB 변경 안내

## 이번 ZIP의 담당 범위

이번 작업은 사용자 기능과 관리자 신고·가입승인 화면만 반영했다. 동기가 작업하기로 한 관리자 사장님 채팅 기능 파일은 새로 만들거나 수정하지 않았다.

### 사용자 기능

- 내 활동 페이지에서 내가 작성한 리뷰·커뮤니티 글 확인
- 리뷰·커뮤니티 글 수정 페이지
- 본인이 작성한 리뷰·게시글 수정·삭제
- 타인이 작성한 리뷰·게시글 신고
- 신고 사유 드롭다운 및 신고 완료 팝업
- 리뷰·게시글 삭제 확인 팝업
- 마이페이지 Figma 스타일 보정
- 로그아웃 확인 팝업
- 재학생 인증 완료 상태에 따른 마이페이지 이동

### 관리자 기능

- `/admin/reports`: 전체·게시글·리뷰·처리완료 신고 탭
- 신고 처리 팝업과 처리 조치 선택
- 신고 대상 내용과 신고 누적 데이터 표시 기반
- `/admin/owners`: 대기·완료·반려 사장님 가입 승인 탭
- 승인·반려 처리
- 상단 관리자 왕관 표시

## DB 스키마 변경

`prisma/schema.prisma`에 다음을 추가했다.

### User

- `role`: `USER`, `OWNER`, `ADMIN`
- `ownerApprovalStatus`: `NONE`, `PENDING`, `APPROVED`, `REJECTED`
- `createdAt`, `updatedAt`

### Restaurant

- `ownerId`: 식당과 사장님 계정 연결
- `imageUrl`: 대표 이미지 URL
- `createdAt`, `updatedAt`
- `RestaurantPhoto`: 여러 식당 사진 저장

### Review

- `updatedAt`: 수정일
- `deletedAt`: soft delete용 삭제일
- `Report`와의 관계

### Community

- `content`: 게시글 내용 저장
- `createdAt`, `updatedAt`
- `deletedAt`: soft delete용 삭제일
- `Report`와의 관계

### 신규 모델

- `Report`: 게시글·리뷰 신고, 사유, 처리상태, 조치 저장
- `OwnerApplication`: 사장님 가입 요청과 승인·반려 상태 저장

삭제는 데이터를 즉시 지우지 않고 `deletedAt`을 기록하는 방식이다. 따라서 신고 이력과 관리자 확인이 가능하고, 일반 목록에서는 삭제된 데이터가 보이지 않는다.

## 동기와 병합할 때

동기의 관리자 채팅 변경과 충돌을 줄이려면 이 ZIP에서 아래 항목만 먼저 가져오면 된다.

```text
prisma/schema.prisma
app/api/reviews/[reviewId]/route.ts
app/api/reports/route.ts
app/api/activity/route.ts
app/api/community/[postId]/route.ts
app/api/admin/reports/[reportId]/route.ts
app/api/admin/owners/route.ts
app/api/admin/owners/[applicationId]/route.ts
app/my-activity/page.tsx
app/review-edit/[reviewId]/page.tsx
app/community-edit/[postId]/page.tsx
app/admin/reports/page.tsx
app/admin/owners/page.tsx
components/ActionModals.tsx
components/RestaurantDetail.tsx
components/CommunityDetail.tsx
lib/appData.ts
store/userStore.ts
app/globals.css
```

다만 `schema.prisma`, `lib/appData.ts`, `app/globals.css`는 공통 파일이므로 동기 변경사항을 먼저 백업하거나 Git에서 충돌을 확인해야 한다.

## 실행 방법

```powershell
npm install
npx prisma generate
npx prisma db push
npm run dev
```

개발 DB에 새 스키마를 적용하며 기존 데이터를 전부 초기화해야 하는 경우에만 아래를 사용한다.

```powershell
npx prisma db push --force-reset
npm run db:seed
```

`--force-reset`은 현재 DB를 전부 삭제하므로 발표용 초기화 상황에서만 실행한다.

## 확인 URL

```text
http://localhost:3000/my-activity
http://localhost:3000/admin/reports
http://localhost:3000/admin/owners
```

현재 전체 코드에 대해 `npx tsc --noEmit`과 `npm run build` 검증을 통과했다.
