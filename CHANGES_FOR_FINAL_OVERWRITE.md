# 쩝쩝대 최종 수정 ZIP 적용 안내

## 1. 덮어쓰기

이 ZIP을 `package.json`이 있는 프로젝트 루트에 압축 해제하고 같은 이름의 파일을 덮어쓰세요.

```text
my-app/
├─ package.json
├─ app/
├─ components/
├─ lib/
├─ store/
└─ public/
```

압축을 푼 뒤:

```powershell
npm install
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

## 2. 이번 수정 내용

- 로그인 화면 `/login`
- 회원가입 화면 `/signup`
- 로그인·회원가입 API
- 메인 화면 카테고리 제거
- 메인 식당 카드의 별점·리뷰 개수 표시 통일
- 메인 식당 영역과 커뮤니티 영역을 분리
- 메인 커뮤니티 글 클릭 시 `/community/[postId]` 상세 화면으로 이동
- 지도 음식 카테고리 선택에 따른 식당 필터링
- 지도 카테고리 버튼을 모바일 화면 폭에 맞는 6칸 구조로 변경
- 식당별 리뷰 개수 데이터 추가
- 리뷰 제출 전 확인 팝업
- 재학생 인증 팝업 및 인증 완료 체크 표시
- 인증된 사용자만 리뷰 등록 가능
- 리뷰 등록 API 및 DB 저장
- 등록 시 식당 평균 별점 갱신
- AI 리뷰 요약 팝업 디자인 개선

## 3. Kakao 지도 API 연결 방법

1. Kakao Developers에 로그인합니다.
2. `내 애플리케이션`에서 애플리케이션을 추가합니다.
3. `앱 키` 메뉴에서 **JavaScript 키**를 복사합니다.
4. `플랫폼 > Web 플랫폼 등록`에서 로컬 주소를 등록합니다.

```text
http://localhost:3000
http://localhost:3001
```

5. 프로젝트 루트에 `.env.local` 파일을 만들고 입력합니다.

```env
NEXT_PUBLIC_KAKAO_MAP_KEY=복사한_JavaScript_키
```

6. 개발 서버를 반드시 껐다가 다시 실행합니다.

```powershell
Ctrl + C
npm run dev
```

카카오 키를 넣지 않아도 앱은 실행되지만 지도 영역에는 키 설정 안내가 표시됩니다.

## 4. 리뷰 등록 전 준비

리뷰를 실제 DB에 등록하려면:

- MySQL 서버가 실행 중이어야 합니다.
- `.env.local`의 `DATABASE_URL`이 올바르게 설정되어 있어야 합니다.
- `prisma db seed`를 실행해 테스트 계정을 넣을 수 있습니다.

테스트 계정 예시:

```text
이메일: sarang@jjupjjupdae.test
비밀번호: demo1234
```

이 계정은 시드 데이터 기준 재학생 인증 완료 상태입니다.

## 5. 주의사항

- Prisma 스키마는 수정하지 않았습니다.
- 리뷰 사진 업로드는 아직 UI 버튼 단계입니다.
- 재학생 인증 팝업의 `인증하기`는 현재 발표용 UI 흐름이며, 실제 학교 이메일 인증 API는 연결하지 않았습니다.
- `.env.local`은 절대 GitHub에 올리지 마세요.
