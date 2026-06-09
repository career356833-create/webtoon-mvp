export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      const prompt = `
  너는 네이버웹툰 연재 작가, 스토리 작가, 콘티 작가, 연출 PD다.
  
  아래 입력값을 바탕으로 웹툰 1회차 기획안을 생성하라.
  
  장르: ${body.genre}
  작품 컨셉: ${body.concept}
  주인공 설정: ${body.character}
  이번 화 주제: ${body.episode}
  컷 수: ${body.cutCount}
  그림체: ${body.artStyle}
  추가 요청사항: ${body.notes}
  
  규칙:
  - 한국어만 사용하라.
  - 이미지 프롬프트만 영어로 작성하라.
  - **, #, ---, 마크다운 강조 문법을 사용하지 마라.
  - 이상한 외국어를 섞지 마라.
  - 마지막 컷은 다음 화가 궁금하게 끝내라.
  
  반드시 아래 형식을 지켜라.
  
  ### 회차 제목
  내용
  
  ### 회차 요약
  내용
  
  ### 컷 구성
  컷 1
  장면 설명:
  등장인물:
  감정:
  표정:
  카메라 구도:
  연출 의도:
  대사:
  이미지 프롬프트:
  
  컷 2
  장면 설명:
  등장인물:
  감정:
  표정:
  카메라 구도:
  연출 의도:
  대사:
  이미지 프롬프트:
  
  ### 주요 대사
  내용
  
  ### 이미지 프롬프트
  내용
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
        return Response.json(
          { error: data?.error?.message || "OpenRouter 오류" },
          { status: 500 }
        );
      }
  
      const content =
        data.choices?.[0]?.message?.content ||
        data.choices?.[0]?.text ||
        data.output_text ||
        "";
  
      if (!content || content.includes("User Safety")) {
        return Response.json({
          error: "모델 응답이 비정상입니다. 다시 생성해 주세요.",
        });
      }
  
      const cleaned = content
        .replace(/\*\*/g, "")
        .replace(/^#+\s*$/gm, "")
        .replace(/---/g, "")
        .trim();
  
      return Response.json({
        result: cleaned,
      });
    } catch (error) {
      console.error(error);
      return Response.json(
        { error: "생성 실패" },
        { status: 500 }
      );
    }
  }