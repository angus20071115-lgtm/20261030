
let page = "home"; // 設定目前頁面，分為首頁、測驗頁和成績頁
let questions = []; // 建立存放十道英文題目的陣列
let currentQuestion = 0; // 記錄目前進行到第幾題
let selectedAnswer = -1; // 記錄使用者選擇的答案編號
let answered = false; // 判斷目前題目是否已經作答
let score = 0; // 記錄測驗總分
let results = []; // 儲存每一題的作答紀錄
let buttons = []; // 儲存畫面上按鈕的位置
let mediaArea = {}; // 儲存圖片或聽力區域的位置
let audioPlayed = false; // 記錄目前聽力題是否已經自動播放
let audioSupported = true; // 記錄瀏覽器是否支援英文語音
let colors = {}; // 建立畫面使用的顏色資料
// 初始化整個測驗系統
function setup() { // p5.js 啟動時執行的函式
  createCanvas(windowWidth, windowHeight); // 建立全螢幕響應式畫布
  textFont("sans-serif"); // 設定畫面文字字型
  textAlign(CENTER, CENTER); // 設定文字水平與垂直置中
  rectMode(CORNER); // 設定矩形從左上角開始繪製
  colors = { bg: "#F1F5FC", primary: "#5267D9", dark: "#28334D", green: "#27AE60", red: "#E74C3C", white: "#FFFFFF", yellow: "#FFD45C" }; // 設定測驗使用的配色
  questions = [ // 開始建立十道英文題目
    { type: "picture", image: "apple", title: "What is this?", options: ["Apple", "Banana", "Orange", "Grape"], answer: 0, explanation: "Apple 是蘋果。" }, // 第1題：蘋果圖片
    { type: "picture", image: "banana", title: "What is this?", options: ["Orange", "Banana", "Apple", "Watermelon"], answer: 1, explanation: "Banana 是香蕉。" }, // 第2題：香蕉圖片
    { type: "picture", image: "orange", title: "What is this?", options: ["Grape", "Apple", "Orange", "Banana"], answer: 2, explanation: "Orange 是橘子。" }, // 第3題：橘子圖片
    { type: "picture", image: "cat", title: "What animal is this?", options: ["Dog", "Bird", "Rabbit", "Cat"], answer: 3, explanation: "Cat 是貓咪。" }, // 第4題：貓咪圖片
    { type: "picture", image: "dog", title: "What animal is this?", options: ["Dog", "Cat", "Fish", "Bird"], answer: 0, explanation: "Dog 是狗狗。" }, // 第5題：狗狗圖片
    { type: "listening", sound: "Red", title: "Listen and choose the correct word.", options: ["Blue", "Red", "Green", "Yellow"], answer: 1, explanation: "Red 是紅色。" }, // 第6題：紅色聽力
    { type: "listening", sound: "Blue", title: "Listen and choose the correct word.", options: ["Green", "Yellow", "Blue", "Pink"], answer: 2, explanation: "Blue 是藍色。" }, // 第7題：藍色聽力
    { type: "listening", sound: "Yellow", title: "Listen and choose the correct word.", options: ["Purple", "Orange", "Green", "Yellow"], answer: 3, explanation: "Yellow 是黃色。" }, // 第8題：黃色聽力
    { type: "listening", sound: "Green", title: "Listen and choose the correct word.", options: ["Green", "Red", "Black", "White"], answer: 0, explanation: "Green 是綠色。" }, // 第9題：綠色聽力
    { type: "listening", sound: "Purple", title: "Listen and choose the correct word.", options: ["Pink", "Purple", "Brown", "Blue"], answer: 1, explanation: "Purple 是紫色。" } // 第10題：紫色聽力
  ]; // 完成題目資料設定
} // setup 函式結束
// 每一幀重新繪製畫面
function draw() { // p5.js 持續執行的繪圖函式
  background(colors.bg); // 設定整個畫布的背景顏色
  buttons = []; // 清除上一幀的按鈕位置
  if (page === "home") drawHome(); // 如果在首頁就繪製首頁
  if (page === "quiz") drawQuiz(); // 如果在測驗頁就繪製題目
  if (page === "result") drawResult(); // 如果在成績頁就繪製成績
} // draw 函式結束
// 繪製測驗首頁
function drawHome() { // 首頁畫面函式
  fill(colors.primary); // 設定標題顏色
  textSize(min(width * 0.085, 48)); // 設定標題字體大小
  text("English Quiz", width / 2, height * 0.25); // 顯示英文測驗標題
  fill(colors.dark); // 設定說明文字顏色
  textSize(min(width * 0.045, 21)); // 設定說明文字大小
  text("Picture & Listening Test", width / 2, height * 0.34); // 顯示測驗類型
  textSize(min(width * 0.038, 18)); // 設定測驗介紹文字大小
  text("看圖片、聽英文，選出正確答案！", width / 2, height * 0.43); // 顯示中文介紹
  text("10 Questions  •  10 Points", width / 2, height * 0.49); // 顯示題目數量與總分
  drawButton("START", width / 2 - 115, height * 0.63, 230, 65, colors.primary, "start"); // 繪製開始測驗按鈕
} // 首頁函式結束
// 繪製測驗題目頁面
function drawQuiz() { // 測驗畫面函式
  let q = questions[currentQuestion]; // 取得目前題目的資料
  fill(colors.dark); // 設定題數文字顏色
  textSize(min(width * 0.04, 19)); // 設定題數文字大小
  text("QUESTION " + (currentQuestion + 1) + " / " + questions.length, width / 2, height * 0.055); // 顯示目前題數
  fill(colors.primary); // 設定題目文字顏色
  textSize(min(width * 0.047, 23)); // 設定題目文字大小
  text(q.title, width / 2, height * 0.115); // 顯示英文題目
  drawMedia(q); // 繪製圖片或聽力區域
  let gap = 12; // 設定選項按鈕間距
  let bw = min((width * 0.88 - gap) / 2, 280); // 計算選項按鈕寬度
  let bh = min(height * 0.085, 62); // 計算選項按鈕高度
  let startX = width / 2 - bw - gap / 2; // 計算第一個按鈕的水平位置
  let startY = height * 0.56; // 計算第一排按鈕的垂直位置
  for (let i = 0; i < q.options.length; i++) { // 逐一繪製四個答案選項
    let x = startX + (i % 2) * (bw + gap); // 計算目前按鈕的水平位置
    let y = startY + floor(i / 2) * (bh + gap); // 計算目前按鈕的垂直位置
    let c = colors.primary; // 預設按鈕顏色
    if (answered && i === q.answer) c = colors.green; // 正確答案顯示綠色
    else if (answered && i === selectedAnswer) c = colors.red; // 錯誤選項顯示紅色
    else if (answered) c = "#AAB2C5"; // 其他選項顯示灰色
    drawButton(q.options[i], x, y, bw, bh, c, "answer" + i); // 繪製目前的答案按鈕
  } // 選項繪製迴圈結束
  if (answered) { // 如果使用者已經作答
    fill(selectedAnswer === q.answer ? colors.green : colors.red); // 根據答案設定回饋顏色
    textSize(min(width * 0.047, 23)); // 設定對錯文字大小
    text(selectedAnswer === q.answer ? "Correct! ✓" : "Wrong! ✗", width / 2, height * 0.785); // 顯示答對或答錯
    fill(colors.dark); // 設定解說文字顏色
    textSize(min(width * 0.038, 18)); // 設定解說文字大小
    text("Answer: " + q.options[q.answer] + " － " + q.explanation, width / 2, height * 0.84, width * 0.9, 40); // 顯示正確答案與中文解說
    drawButton(currentQuestion === questions.length - 1 ? "SEE MY SCORE" : "NEXT QUESTION", width / 2 - 120, height * 0.91, 240, 50, colors.primary, "next"); // 繪製下一題或成績按鈕
  } // 作答回饋畫面結束
} // 測驗頁函式結束
// 繪製圖片或聽力內容
function drawMedia(q) { // 媒體區域繪製函式
  let boxW = min(width * 0.86, 520); // 設定媒體區域寬度
  let boxH = min(height * 0.32, 225); // 設定媒體區域高度
  let x = width / 2 - boxW / 2; // 計算媒體區域水平位置
  let y = height * 0.18; // 計算媒體區域垂直位置
  mediaArea = { x: x, y: y, w: boxW, h: boxH }; // 記錄媒體區域的位置
  fill(colors.white); // 設定媒體區域背景顏色
  stroke("#DCE3F0"); // 設定媒體區域邊框顏色
  strokeWeight(2); // 設定邊框粗細
  rect(x, y, boxW, boxH, 20); // 繪製圓角媒體區域
  noStroke(); // 關閉後續圖形的邊框
  if (q.type === "picture") { // 判斷目前是否為看圖題
    drawPicture(q.image, x, y, boxW, boxH); // 根據題目繪製對應的圖片
  } else { // 如果目前是聽力題
    fill(colors.primary); // 設定喇叭圖示顏色
    textSize(65 + sin(frameCount * 0.08) * 5); // 讓喇叭圖示產生輕微動畫
    text("🔊", width / 2, y + boxH * 0.43); // 顯示喇叭圖示
    fill(colors.dark); // 設定提示文字顏色
    textSize(min(width * 0.035, 16)); // 設定提示文字大小
    text("Tap here to listen again", width / 2, y + boxH * 0.79); // 顯示點擊重聽提示
  } // 媒體種類判斷結束
} // 媒體繪製函式結束
// 根據題目繪製不同的英文圖片
function drawPicture(type, x, y, w, h) { // 看圖題圖片繪製函式
  push(); // 儲存目前的繪圖設定
  translate(width / 2, y + h / 2); // 將繪圖原點移至圖片區域中央
  let s = min(w / 250, h / 180); // 計算圖片縮放比例
  scale(s); // 根據螢幕大小縮放圖片
  if (type === "apple") drawApple(); // 如果題目是蘋果就繪製蘋果
  if (type === "banana") drawBanana(); // 如果題目是香蕉就繪製香蕉
  if (type === "orange") drawOrange(); // 如果題目是橘子就繪製橘子
  if (type === "cat") drawCat(); // 如果題目是貓咪就繪製貓咪
  if (type === "dog") drawDog(); // 如果題目是狗狗就繪製狗狗
  pop(); // 還原原本的繪圖設定
} // 圖片繪製函式結束
// 繪製蘋果圖片
function drawApple() { // 蘋果繪製函式
  fill("#E94343"); // 設定蘋果紅色
  noStroke(); // 移除圖形邊框
  ellipse(-22, 12, 92, 105); // 繪製蘋果左半部
  ellipse(22, 12, 92, 105); // 繪製蘋果右半部
  fill("#E94343"); // 設定蘋果頂部顏色
  triangle(-45, -28, 0, -48, 45, -28); // 繪製蘋果頂部
  fill("#75452C"); // 設定蘋果果梗顏色
  rect(-4, -62, 9, 25, 5); // 繪製蘋果果梗
  fill("#39A65A"); // 設定蘋果葉子顏色
  ellipse(20, -52, 32, 15); // 繪製蘋果葉子
  fill("#FFFFFF"); // 設定蘋果亮點顏色
  ellipse(-34, -3, 12, 23); // 繪製蘋果表面亮點
} // 蘋果繪製結束
// 繪製香蕉圖片
function drawBanana() { // 香蕉繪製函式
  push(); // 儲存繪圖設定
  rotate(-0.35); // 旋轉香蕉的方向
  noFill(); // 設定香蕉內部透明
  stroke("#E7B92F"); // 設定香蕉外框顏色
  strokeWeight(30); // 設定香蕉粗細
  arc(0, -15, 170, 125, 0.15, PI - 0.15); // 繪製香蕉主體
  stroke("#F8D84A"); // 設定香蕉內側顏色
  strokeWeight(21); // 設定香蕉內側粗細
  arc(0, -15, 170, 125, 0.15, PI - 0.15); // 繪製香蕉內側
  stroke("#79512F"); // 設定香蕉果梗顏色
  strokeWeight(9); // 設定果梗粗細
  line(-84, -15, -88, -30); // 繪製香蕉左側果梗
  line(84, -15, 88, -30); // 繪製香蕉右側果梗
  pop(); // 還原繪圖設定
  noStroke(); // 移除圖形邊框
} // 香蕉繪製結束
// 繪製橘子圖片
function drawOrange() { // 橘子繪製函式
  noStroke(); // 移除圖形邊框
  fill("#F28C28"); // 設定橘子橘色
  circle(0, 10, 120); // 繪製橘子圓形主體
  fill("#F7A33D"); // 設定橘子亮面顏色
  circle(-20, -8, 35); // 繪製橘子亮面
  fill("#3B9B54"); // 設定橘子葉子顏色
  ellipse(20, -62, 40, 17); // 繪製橘子葉子
  fill("#79512F"); // 設定橘子果梗顏色
  rect(-3, -65, 8, 17, 3); // 繪製橘子果梗
} // 橘子繪製結束
// 繪製貓咪圖片
function drawCat() { // 貓咪繪製函式
  noStroke(); // 移除圖形邊框
  fill("#E9A66A"); // 設定貓咪毛色
  ellipse(0, 30, 120, 95); // 繪製貓咪身體
  triangle(-55, -35, -48, -95, -8, -50); // 繪製左耳朵
  triangle(55, -35, 48, -95, 8, -50); // 繪製右耳朵
  ellipse(0, -18, 112, 100); // 繪製貓咪頭部
  fill("#F7C4A1"); // 設定耳朵內部顏色
  triangle(-42, -55, -40, -82, -19, -53); // 繪製左耳內部
  triangle(42, -55, 40, -82, 19, -53); // 繪製右耳內部
  fill("#FFFFFF"); // 設定眼睛顏色
  ellipse(-23, -25, 20, 25); // 繪製左眼睛
  ellipse(23, -25, 20, 25); // 繪製右眼睛
  fill("#26334D"); // 設定瞳孔顏色
  circle(-23, -24, 9); // 繪製左瞳孔
  circle(23, -24, 9); // 繪製右瞳孔
  fill("#F28C9B"); // 設定鼻子顏色
  triangle(-7, -5, 7, -5, 0, 3); // 繪製貓咪鼻子
  stroke("#79512F"); // 設定嘴巴顏色
  strokeWeight(2); // 設定嘴巴線條粗細
  noFill(); // 設定嘴巴內部透明
  arc(-5, 4, 15, 12, 0, HALF_PI); // 繪製嘴巴左半部
  arc(5, 4, 15, 12, HALF_PI, PI); // 繪製嘴巴右半部
  stroke("#79512F"); // 設定鬍鬚顏色
  line(-35, -5, -75, -12); // 繪製左上鬍鬚
  line(-35, 5, -75, 10); // 繪製左下鬍鬚
  line(35, -5, 75, -12); // 繪製右上鬍鬚
  line(35, 5, 75, 10); // 繪製右下鬍鬚
  noStroke(); // 移除圖形邊框
} // 貓咪繪製結束
// 繪製狗狗圖片
function drawDog() { // 狗狗繪製函式
  noStroke(); // 移除圖形邊框
  fill("#B97845"); // 設定狗狗毛色
  ellipse(0, 28, 125, 100); // 繪製狗狗身體
  ellipse(0, -18, 112, 105); // 繪製狗狗頭部
  fill("#85502F"); // 設定狗狗耳朵顏色
  ellipse(-57, -13, 32, 68); // 繪製左耳朵
  ellipse(57, -13, 32, 68); // 繪製右耳朵
  fill("#FFFFFF"); // 設定眼睛顏色
  circle(-22, -28, 20); // 繪製左眼睛
  circle(22, -28, 20); // 繪製右眼睛
  fill("#26334D"); // 設定瞳孔顏色
  circle(-22, -28, 9); // 繪製左瞳孔
  circle(22, -28, 9); // 繪製右瞳孔
  fill("#F0C49A"); // 設定嘴巴周圍顏色
  ellipse(0, 5, 48, 37); // 繪製狗狗嘴巴
  fill("#26334D"); // 設定鼻子顏色
  ellipse(0, -2, 19, 13); // 繪製狗狗鼻子
  fill("#E96F78"); // 設定舌頭顏色
  ellipse(0, 25, 15, 21); // 繪製狗狗舌頭
} // 狗狗繪製結束
// 繪製共用的大型按鈕
function drawButton(label, x, y, w, h, c, id) { // 按鈕繪製函式
  fill(c); // 設定按鈕背景顏色
  noStroke(); // 移除按鈕邊框
  rect(x, y, w, h, 14); // 繪製圓角按鈕
  fill(colors.white); // 設定按鈕文字顏色
  textSize(min(h * 0.34, 20)); // 設定按鈕文字大小
  text(label, x + w / 2, y + h / 2); // 繪製按鈕文字
  buttons.push({ x: x, y: y, w: w, h: h, id: id }); // 記錄按鈕的位置與功能
} // 按鈕函式結束
// 繪製聽力題的英文語音
function playEnglish(textToSpeak) { // 英文語音播放函式
  if (!("speechSynthesis" in window)) { // 檢查瀏覽器是否支援語音合成
    audioSupported = false; // 設定瀏覽器不支援語音
    return; // 停止語音播放
  } // 瀏覽器支援判斷結束
  window.speechSynthesis.cancel(); // 先停止上一段語音
  let speech = new SpeechSynthesisUtterance(textToSpeak); // 建立英文語音內容
  speech.lang = "en-US"; // 設定語音為美式英文
  speech.rate = 0.8; // 放慢語速方便初學者聆聽
  speech.pitch = 1; // 設定正常音調
  speech.volume = 1; // 設定最大播放音量
  window.speechSynthesis.speak(speech); // 播放英文語音
} // 英文語音函式結束
// 進入目前題目時處理自動播放
function enterQuestion() { // 題目進入處理函式
  audioPlayed = false; // 重設自動播放紀錄
  let q = questions[currentQuestion]; // 取得目前題目
  if (q.type === "listening") { // 如果目前題目是聽力題
    audioPlayed = true; // 標記已經執行自動播放
    playEnglish(q.sound); // 自動播放一次英文單字
  } // 聽力題判斷結束
} // 題目進入函式結束
// 開始測驗
function startQuiz() { // 測驗開始函式
  page = "quiz"; // 切換到測驗頁面
  currentQuestion = 0; // 回到第一題
  selectedAnswer = -1; // 清除先前選擇
  answered = false; // 重設作答狀態
  score = 0; // 將總分歸零
  results = []; // 清空所有答題紀錄
  enterQuestion(); // 進入第一題並檢查是否需要播放聲音
} // 開始測驗函式結束
// 處理滑鼠點擊事件
function mousePressed() { // p5.js 滑鼠點擊事件
  if (page === "quiz" && !answered && questions[currentQuestion].type === "listening") { // 判斷是否為尚未作答的聽力題
    if (mouseX >= mediaArea.x && mouseX <= mediaArea.x + mediaArea.w && mouseY >= mediaArea.y && mouseY <= mediaArea.y + mediaArea.h) { // 判斷是否點擊聽力播放區域
      playEnglish(questions[currentQuestion].sound); // 再次播放目前的英文單字
    } // 聽力區域點擊判斷結束
  } // 聽力重播判斷結束
  for (let b of buttons) { // 逐一檢查畫面中的按鈕
    if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) { // 判斷滑鼠是否點擊按鈕
      handleButton(b.id); // 執行被點擊的按鈕功能
      break; // 找到按鈕後停止檢查
    } // 按鈕位置判斷結束
  } // 按鈕迴圈結束
  return false; // 阻止瀏覽器預設點擊行為
} // 滑鼠事件結束
// 處理所有按鈕的功能
function handleButton(id) { // 按鈕功能處理函式
  if (id === "start") { // 如果使用者按下開始測驗
    startQuiz(); // 開始新的測驗
    return; // 結束函式
  } // 開始按鈕判斷結束
  if (id.startsWith("answer") && !answered) { // 如果點擊答案而且尚未作答
    selectedAnswer = int(id.replace("answer", "")); // 取得使用者選擇的答案編號
    answered = true; // 將目前題目設定為已作答
    let correct = selectedAnswer === questions[currentQuestion].answer; // 判斷答案是否正確
    if (correct) score++; // 如果答對就增加一分
    results.push({ selected: selectedAnswer, correct: correct }); // 儲存本題答題結果
    return; // 結束答案處理
  } // 答案按鈕判斷結束
  if (id === "next" && answered) { // 如果點擊下一題且已經作答
    currentQuestion++; // 前往下一題
    if (currentQuestion >= questions.length) { // 判斷是否已經完成全部題目
      page = "result"; // 切換到成績頁
      if ("speechSynthesis" in window) window.speechSynthesis.cancel(); // 停止可能尚未播放完畢的語音
    } else { // 如果還有下一題
      selectedAnswer = -1; // 清除上一題的答案
      answered = false; // 重設作答狀態
      enterQuestion(); // 進入下一題並自動播放聽力
    } // 下一題判斷結束
  } // 下一題按鈕判斷結束
  if (id === "restart") startQuiz(); // 如果按下重新測驗就重新開始
} // 按鈕處理函式結束
// 繪製最後的成績頁面
function drawResult() { // 成績頁函式
  fill(colors.primary); // 設定標題顏色
  textSize(min(width * 0.08, 42)); // 設定標題大小
  text("Quiz Completed!", width / 2, height * 0.09); // 顯示測驗完成
  fill(colors.dark); // 設定成績文字顏色
  textSize(min(width * 0.065, 34)); // 設定成績文字大小
  text("Your Score: " + score + " / 10", width / 2, height * 0.19); // 顯示測驗總分
  let stars = score >= 9 ? 3 : score >= 6 ? 2 : score >= 3 ? 1 : 0; // 根據分數計算星星數量
  fill("#F5B82E"); // 設定星星顏色
  textSize(min(width * 0.09, 43)); // 設定星星大小
  text("★".repeat(stars) + "☆".repeat(3 - stars), width / 2, height * 0.28); // 顯示星星評價
  fill(colors.dark); // 設定答題紀錄顏色
  textSize(min(width * 0.04, 18)); // 設定紀錄文字大小
  text("Answer Records 答題紀錄", width / 2, height * 0.36); // 顯示答題紀錄標題
  let rowH = min(height * 0.045, 32); // 設定每一列紀錄的高度
  let startY = height * 0.415; // 設定紀錄的起始位置
  let colX = width / 2; // 設定紀錄的水平位置
  for (let i = 0; i < results.length; i++) { // 逐一顯示十題的結果
    let r = results[i]; // 取得目前題目的作答資料
    fill(r.correct ? colors.green : colors.red); // 根據答題結果設定顏色
    textSize(min(width * 0.037, 17)); // 設定紀錄文字大小
    let label = "Q" + (i + 1) + "   " + (r.correct ? "✓ Correct" : "✗ Wrong"); // 建立答題紀錄文字
    text(label, colX, startY + i * rowH); // 顯示目前題目的對錯
  } // 答題紀錄迴圈結束
  drawButton("PLAY AGAIN", width / 2 - 115, height * 0.90, 230, 50, colors.primary, "restart"); // 繪製重新測驗按鈕
} // 成績頁函式結束
// 當視窗大小改變時重新調整畫布
function windowResized() { // 瀏覽器視窗尺寸變更函式
  resizeCanvas(windowWidth, windowHeight); // 重新設定畫布寬度與高度
} // 視窗調整函式結束
