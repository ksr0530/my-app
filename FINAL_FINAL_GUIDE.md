# 쩝쩝대 최종 수정 적용 안내

이 파일은 동기 최신 원격 커밋 `26a52b6 (최종?)` 기준으로 수정한 내용입니다.

## 적용 순서

동기 최신 코드를 Pull 받은 프로젝트 루트(`package.json`이 있는 위치)에 ZIP을 압축 해제하고 파일을 덮어쓴 뒤 실행하세요.

```powershell
npm install
npx prisma generate
npx prisma db push
npm run db:seed
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

## 이번 최종 수정

- `http://localhost:3000/` 접속 시 바로 `/login`으로 이동
- 로그인 성공 후 `/home`으로 이동
- 하단 홈 메뉴와 식당 상세의 홈 돌아가기 경로를 `/home`으로 변경
- 리뷰작성 화면의 재학생 인증 영역을 제공된 이미지처럼 변경
  - 네이비 체크박스
  - `재학생 인증 완료` 문구
  - 오른쪽 `인증 정보 확인` 링크
  - 아래 인증 완료 안내 문구
- 커뮤니티 글 상세의 `배달메이트 참여하기` 버튼을 가운데 정렬
- 댓글 입력창을 넓히고 높이를 키웠으며 등록 버튼도 함께 정리
- 시드 DB 식당 좌표를 부천대학교 주변 좌표로 정정
- 기존 Prisma의 음식 카테고리·추천 인원수 필드는 유지

## 발표용 로그인

```text
아이디: demo-user
비밀번호: demo1234
```

## 주의

- `prisma db push`와 `npm run db:seed`는 동기 컴퓨터의 실제 `.env`가 가리키는 DB에서 실행해야 합니다.
- DB의 실제 계정·식당 데이터는 실행한 DB에만 반영됩니다.
- 댓글은 현재 발표용 화면에서 입력·등록되는 상태이며, 댓글을 DB에 영구 저장하는 Comment 모델은 이번 최종 수정 범위에 포함하지 않았습니다.
