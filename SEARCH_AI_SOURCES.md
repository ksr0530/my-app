# Search and AI implementation sources

- Kakao Local API official guide: https://developers.kakao.com/docs/ko/local/dev-guide
  - Keyword search endpoint: `GET https://dapi.kakao.com/v2/local/search/keyword.json`
  - REST key header: `Authorization: KakaoAK ${REST_API_KEY}`
  - Query parameters used here: `query`, `x`, `y`, `radius`, `size`, `sort`
  - Place fields used here: `id`, `place_name`, `category_name`, `category_group_code`, `phone`, `address_name`, `road_address_name`, `x`, `y`, `place_url`

- Google Gemini official Generate Content API reference: https://ai.google.dev/api/generate-content
  - Server-side `generateContent` request is used with `GEMINI_API_KEY`.
  - The recommendation route reads text from `candidates[0].content.parts[].text` and validates returned restaurant IDs before displaying them.
