export async function POST() {
    try {
      const prompt = `
  너는 네이버웹툰 전문 기획자다.
  
  웹툰 아이디어를 랜덤으로 생성하라.
  
  반드시 아래 JSON 형식만 출력하라.
  
  {
    "genre": "",
    "concept": "",
    "character": "",
    "episode": "",
    "cutCount": "",
    "artStyle": "",
    "notes": ""
  }
  
  장르는 매번 다양하게 생성하라.
  
  병맛개그, 학원물, 추억물, 직장인, 헌터물, 판타지, 로맨스, 공포, 미스터리 등 자유롭게 생성하라.
  
  JSON 외의 설명은 절대 출력하지 마라.
  `;
  
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat-v3.1",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );
  
      const data = await response.json();
  
      return Response.json({
        result: data.choices?.[0]?.message?.content,
      });
    } catch (error) {
      console.error(error);
  
      return Response.json(
        { error: "랜덤 기획 생성 실패" },
        { status: 500 }
      );
    }
  }