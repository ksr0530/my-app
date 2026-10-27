# 쩝쩝대 최종 정리 적용 안내

이번 파일은 동기 최신 커밋 `06f3bd1 wo제발퇴종` 위에 최종 수정한 전체 프로젝트 소스입니다.

## 적용 방법

1. 동기 프로젝트 폴더의 내용을 먼저 최신 Pull 상태로 맞춥니다.
2. 이 ZIP을 `package.json`이 있는 프로젝트 루트에 압축 해제하고 전체 덮어씁니다.
3. 기존 `.env` 또는 `.env.local`은 삭제하지 말고 그대로 유지합니다.
4. 터미널에서 아래 명령을 실행합니다.

```powershell
npm install
npx prisma generate
npx prisma db push
npm run db:seed
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

## 삭제되는 테스트 데이터

`npm run db:seed` 실행 시 다음이 정리됩니다.

- `restaurant-001`인 `학생식당 오늘한끼`에 기존에 저장된 리뷰 삭제
- 제목이 정확히 `dd`인 커뮤니티 글 삭제
- 브라우저 localStorage에 저장된 제목 `dd` 커뮤니티 글 자동 삭제
- fallback 데이터에서도 학생식당 오늘한끼 테스트 리뷰 제거

따라서 DB에서 실제로 삭제하려면 반드시 `npm run db:seed`까지 실행해야 합니다.

## 화면 수정

- 리뷰작성 재학생 인증 영역을 제공한 이미지 형태로 변경
- `재학생 인증 완료` 네이비 체크 박스
- 오른쪽 `인증 정보 확인` 링크
- 아래 인증 완료 안내 문구
- 커뮤니티 상세의 `배달메이트 참여하기` 버튼 가운데 정렬
- 댓글 입력창을 넓고 높게 수정
- 댓글 등록 버튼도 입력창과 같은 높이로 정리
- 루트 접속 시 로그인 화면 표시
- 로그인 성공 후 `/home`으로 이동

## 발표용 로그인

```text
아이디: demo-user
비밀번호: demo1234
```

## 주의

이번 seed 정리는 `학생식당 오늘한끼`의 리뷰를 모두 삭제합니다. 해당 식당에 발표용 샘플 리뷰를 다시 넣고 싶다면 seed 파일에 별도 샘플을 추가해야 합니다.
