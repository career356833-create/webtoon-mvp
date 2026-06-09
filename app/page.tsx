"use client";

import { useEffect, useState } from "react";

type FormData = {
  genre: string;
  concept: string;
  character: string;
  episode: string;
  cutCount: string;
  artStyle: string;
  notes: string;
};

export default function Home() {
  const [form, setForm] = useState<FormData>({
    genre: "",
    concept: "",
    character: "",
    episode: "",
    cutCount: "",
    artStyle: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [savedResults, setSavedResults] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("webtoon-results");
    if (saved) setSavedResults(JSON.parse(saved));
  }, []);

  const update = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fillExample = () => {
    setForm({
      genre: "일상개그",
      concept: "2000년대 PC방 추억을 다룬 코믹 웹툰",
      character: "황방울, 30대 남자, 허세가 있지만 속은 착함, 게임과 할인행사에 약함",
      episode: "다이소에 갔다가 이상한 물건을 사면서 벌어지는 하루",
      cutCount: "8",
      artStyle: "한국 웹툰 스타일, 코믹한 표정, 선명한 선화, 과장된 리액션",
      notes: "마지막 컷은 다음 화가 궁금해지게 끝내기",
    });
  };

  const resetForm = () => {
    setForm({
      genre: "",
      concept: "",
      character: "",
      episode: "",
      cutCount: "",
      artStyle: "",
      notes: "",
    });
  };

  const generateWebtoon = async () => {
    try {
      setLoading(true);
      setResult("");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.result) setResult(data.result);
      else if (data.error) setResult("API 오류: " + data.error);
      else setResult("응답 오류:\n" + JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setResult("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const saveResult = () => {
    if (!result) return;
    const updated = [result, ...savedResults];
    setSavedResults(updated);
    localStorage.setItem("webtoon-results", JSON.stringify(updated));
    alert("저장 완료");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <section className="mb-8 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 shadow-2xl sm:p-8">
          <p className="mb-3 text-sm font-semibold text-indigo-100">AI WEBTOON MVP</p>
          <h1 className="break-keep text-3xl font-black tracking-tight sm:text-5xl">
            AI Webtoon Episode Studio
          </h1>
          <p className="mt-4 max-w-2xl break-keep text-base leading-7 text-indigo-50 sm:text-lg">
            입력값을 바탕으로 웹툰 회차 기획, 컷 구성, 대사, 이미지 프롬프트를 자동 생성하는 테스트 화면입니다.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">입력 정보</h2>

              <div className="flex gap-2">
                <button
                  onClick={fillExample}
                  className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600"
                >
                  🎲 예시 자동입력
                </button>

                <button
                  onClick={resetForm}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500"
                >
                  초기화
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <Field label="장르" value={form.genre} onChange={(v) => update("genre", v)} placeholder="예: 일상개그, 학원물, 로맨스" />
              <TextField label="작품 컨셉" value={form.concept} onChange={(v) => update("concept", v)} placeholder="예: 2000년대 PC방 추억을 다룬 코믹 웹툰" />
              <TextField label="주인공 설정" value={form.character} onChange={(v) => update("character", v)} placeholder="예: 30대 남자, 소심함, 게임을 좋아함" />
              <TextField label="이번 화 주제" value={form.episode} onChange={(v) => update("episode", v)} placeholder="예: PC방에서 첫사랑을 만나는 이야기" />
              <Field label="컷 수" value={form.cutCount} onChange={(v) => update("cutCount", v)} placeholder="예: 8" />
              <Field label="그림체" value={form.artStyle} onChange={(v) => update("artStyle", v)} placeholder="예: 한국 웹툰 스타일" />
              <TextField label="추가 요청사항" value={form.notes} onChange={(v) => update("notes", v)} placeholder="예: 마지막은 감성적으로" />

              <button
                disabled={loading}
                onClick={generateWebtoon}
                className="w-full rounded-2xl bg-indigo-500 px-6 py-4 text-lg font-black text-white shadow-lg transition hover:bg-indigo-400 disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? "생성중..." : "웹툰 기획 생성하기"}
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-white p-5 text-slate-900 shadow-xl sm:p-7">
            <h2 className="mb-5 text-2xl font-black">생성 결과</h2>

            {!loading && !result && (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <p className="break-keep text-slate-500">
                  왼쪽 정보를 입력하고 버튼을 누르면 이곳에 결과가 표시됩니다.
                </p>
              </div>
            )}

            {loading && (
              <div className="rounded-2xl bg-slate-50 p-6 text-center font-bold text-indigo-700">
                생성중...
              </div>
            )}

            {result && (
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-bold">생성 결과</h2>

                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(result);
                        alert("전체 복사 완료");
                      }}
                      className="rounded-lg bg-indigo-500 px-4 py-2 text-white"
                    >
                      전체 복사
                    </button>

                    <button
                      onClick={saveResult}
                      className="rounded-lg bg-green-600 px-4 py-2 text-white"
                    >
                      저장
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <ResultCards result={result} />
                </div>
              </div>
            )}

            {savedResults.length > 0 && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 text-lg font-black text-slate-800">저장된 결과</h3>

                <div className="space-y-3">
                  {savedResults.map((item, index) => (
                    <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="font-bold text-slate-800">
                          {item.match(/### 회차 제목\s*([\s\S]*?)(\n|$)/)?.[1]?.trim() || `저장 결과 ${index + 1}`}
                        </p>

                        <div className="flex gap-2">
  <button
    onClick={() => {
      setResult(item);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-bold text-white"
  >
    열기
  </button>

  <button
    onClick={() => {
      const updated = savedResults.filter((_, i) => i !== index);

      setSavedResults(updated);

      localStorage.setItem(
        "webtoon-results",
        JSON.stringify(updated)
      );
    }}
    className="rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white"
  >
    삭제
  </button>
</div>
                      </div>

                      <p className="line-clamp-3 whitespace-pre-wrap text-sm text-slate-600">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block break-keep text-sm font-bold text-slate-200">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
        placeholder={placeholder}
      />
    </label>
  );
}

function TextField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block break-keep text-sm font-bold text-slate-200">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 leading-7 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
        placeholder={placeholder}
      />
    </label>
  );
}

function ResultCards({ result }: { result: string }) {
  const sections = result
    .split("### ")
    .filter(Boolean)
    .map((section) => {
      const lines = section.split("\n");
      const title = lines[0].trim();
      const body = lines.slice(1).join("\n").trim();
      return { title, body };
    });

  return (
    <div className="space-y-5">
      {sections.map((section, index) => (
        <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="break-keep text-xl font-black text-indigo-700">
              {section.title}
            </h3>

            <button
              onClick={async () => {
                await navigator.clipboard.writeText(section.body);
                alert("복사 완료");
              }}
              className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white"
            >
              복사
            </button>
          </div>

          <p className="whitespace-pre-wrap break-keep leading-7 text-slate-700">
            {section.body}
          </p>
        </div>
      ))}
    </div>
  );
}