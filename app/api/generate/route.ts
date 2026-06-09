export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      const prompt = `
  너는 네이버웹툰 연재 작가, 스토리 작가, 콘티 작가, 연출 PD다.

독자가 다음 화를 보고 싶어지도록 만들어라.

절대 밋밋하게 쓰지 마라.

중요:

출력은 반드시 100% 한국어로 작성하라.

영어, 일본어, 중국어, 프랑스어, 아랍어 등
한국어 이외의 언어 사용을 금지한다.

이미지 프롬프트를 제외한 모든 내용은 한국어만 사용하라.

한국어 외 문자가 포함되면 실패로 간주한다.

모든 컷에는 다음 요소가 포함되어야 한다.

- 장면 설명
- 등장인물
- 감정
- 표정
- 카메라 구도
- 연출 의도
- 대사
- 이미지 생성 프롬프트

웹툰의 핵심은 정보 전달이 아니라 재미와 몰입이다.

평범한 전개를 피하고 독자의 감정을 움직여라.

마지막 컷에는 반드시 다음 화가 궁금해지는 장치를 넣어라.
  
  아래 입력값을 바탕으로 웹툰 1회차 기획안을 생성하라.
  
  장르: ${body.genre}
  작품 컨셉: ${body.concept}
  주인공 설정: ${body.character}
  이번 화 주제: ${body.episode}
  컷 수: ${body.cutCount}
  그림체: ${body.artStyle}
  추가 요청사항: ${body.notes}
  
  반드시 아래 형식을 정확하게 준수하라.

### 회차 제목
(내용)

### 회차 요약
(내용)

### 컷 구성

중요:

절대 "컷 1", "컷 2"만 쓰지 마라.

반드시 아래 형식으로 시작하라.

#### 컷 1

#### 컷 2

#### 컷 3

모든 컷 제목 앞에는 반드시 #### 를 붙여라.

각 컷은 반드시 아래 형식을 그대로 반복하라.

#### 컷 1
장면 설명:
등장인물:
감정:
표정:
카메라 구도:
연출 의도:
대사:
이미지 프롬프트:

#### 컷 2
장면 설명:
등장인물:
감정:
표정:
카메라 구도:
연출 의도:
대사:
이미지 프롬프트:

위 형식을 사용자가 입력한 컷 수만큼 반복하라.

### 주요 대사
(내용)

### 이미지 프롬프트
(내용)

마크다운 형식을 반드시 유지하라.

섹션 제목은 절대 변경하지 마라.

반드시 한국어로 작성하라.

한국어 문장은 반드시 자연스럽고 정확한 현대 한국어로 작성하라.
의미가 불분명한 단어 조합, 번역체, 깨진 문장, 이상한 고유명사 조합을 절대 사용하지 마라.
출력 전에 모든 문장을 검토해서 사람이 읽기에 자연스러운 웹툰 대본으로 다듬어라.

등장인물 이름, 사물 이름, 사건 전개는 사용자가 입력한 설정을 우선하라.
사용자가 입력하지 않은 이상한 물건명이나 의미 없는 단어를 임의로 만들지 마라.

이미지 프롬프트만 영어로 작성하라.
  `;
  
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error(data);
        return Response.json(
          { error: data?.error?.message || "OpenRouter 오류" },
          { status: 500 }
        );
      }
  
      const content = data.choices?.[0]?.message?.content;

console.log("OPENROUTER DATA:", JSON.stringify(data, null, 2));

return Response.json({
  result: content || "결과가 비어 있습니다.\n\n" + JSON.stringify(data, null, 2),
});
    } catch (error) {
      console.error(error);
      return Response.json(
        { error: "생성 실패" },
        { status: 500 }
      );
    }
  }