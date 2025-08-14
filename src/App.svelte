<script>
  import { onMount } from 'svelte';
  import { supabase } from './lib/supabaseClient.js';

  // --- アプリの状態を管理する変数 ---
  let allQuizzes = [];      // Supabaseから取得した全クイズデータ
  let currentQuizIndex = 0;
  let isLoading = true;     // ローディング中かどうかを管理

  // --- 画面に表示するための変数 ---
  let questionText = "クイズを読み込んでいます...";
  let userAnswer = "";      // テキスト入力欄とこの変数を連動させる
  let isResultVisible = false;
  let resultMessage = "";
  let modelAnswer = "";
  let isCorrect = false;

  // --- 画面が表示された時に一度だけ実行される処理 ---
  onMount(async () => {
    // supabaseの'quizzes'テーブルから全ての列(*)のデータを取得
    const { data, error } = await supabase.from('English-app').select('*');

    if (error) {
      // データの取得に失敗した場合
      questionText = "クイズの読み込みに失敗しました。";
      console.error('データの取得に失敗:', error);
    } else {
      // 成功した場合
      allQuizzes = shuffleArray(data); // 取得したデータをシャッフル
      showQuiz();                      // 最初の問題を表示
      isLoading = false;               // ローディング完了
    }
  });

  // --- アプリのロジックを担う関数 ---

  // 現在の問題を表示する関数
  function showQuiz() {
    // Supabaseの列名に合わせて`.question`に変更
    questionText = allQuizzes[currentQuizIndex].question;
    userAnswer = "";
    isResultVisible = false;
  }

  // こたえあわせをする関数
  function checkAnswer() {
    isResultVisible = true;
    const currentQuiz = allQuizzes[currentQuizIndex];
    // Supabaseの列名に合わせて`.answer`に変更
    modelAnswer = currentQuiz.answer;

    if (userAnswer.trim() === modelAnswer) { // trim()で前後の空白を削除して比較
      resultMessage = "正解！🎉";
      isCorrect = true;
    } else {
      resultMessage = "ざんねん！";
      isCorrect = false;
    }
  }

  // 次の問題へ進む関数
  function nextQuestion() {
    currentQuizIndex++;
    if (currentQuizIndex < allQuizzes.length) {
      showQuiz();
    } else {
      // 全ての問題が終わった場合
      questionText = "クイズ終了です。お疲れ様でした！";
      isLoading = true; // 入力欄などをまとめて非表示にする
    }
  }

  // 配列をシャッフルする関数
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
</script>

<header>
  <h1>瞬間英作文トレーニング</h1>
</header>

<main>
  <section id="question-area">
    <h2>お題</h2>
    <p>{questionText}</p>
  </section>

  {#if !isLoading}
    <section id="answer-area">
      <input type="text" placeholder="ここに英文を入力" bind:value={userAnswer}>
      <button on:click={checkAnswer}>こたえあわせ</button>
    </section>

    {#if isResultVisible}
      <section id="result-area">
        <h3 class:correct={isCorrect} class:incorrect={!isCorrect}>
          {resultMessage}
        </h3>
        <p>模範解答：<span>{modelAnswer}</span></p>
        <button on:click={nextQuestion}>次の問題へ</button>
      </section>
    {/if}
  {/if}
</main>

<footer>
  <p>&copy; 2025 (相馬晴仁)</p>
</footer>

<style>
  /* 以前のstyle.cssの中身をここに貼り付け */
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hiragino Sans", "Noto Sans CJK JP", "Original Yu Gothic", "Yu Gothic", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    line-height: 1.6;
    background-color: #f0f2f5;
    color: #333;
    margin: 0;
    padding: 20px;
  }
  main {
    max-width: 600px;
    margin: 40px auto;
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  header, footer { text-align: center; }
  section { margin-bottom: 20px; }
  input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  button {
    display: block;
    width: 100%;
    padding: 12px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }
  button:hover { background-color: #0056b3; }
  #result-area {
    border-top: 1px solid #eee;
    padding-top: 20px;
  }
  .hidden { display: none; }
  #result-message.correct {
    color: #28a745;
    font-weight: bold;
  }
  #result-message.incorrect {
    color: #dc3545;
    font-weight: bold;
  }
</style>