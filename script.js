// 當前選擇的寵物類型
let currentPet = 'dog';

// 貓貓月份對照表（改用月份為鍵值）
const catMonthTable = {
  0: 0, 1: 1,
  2: 2, 3: 4, 4: 6, 5: 8, 6: 10,
  7: 12,
  12: 15,
  18: 21,
  24: 24,
  36: 28,
  48: 32,
  60: 36,
  72: 40,
  84: 44,
  96: 48,
  108: 52,
  120: 56,
  132: 60,
  144: 64,
  156: 68,
  168: 72,
  180: 76,
  192: 80,
  204: 84,
  216: 88,
  228: 92,
  240: 96,
  252: 100,
  264: 104,
  276: 108,
  288: 112,
  300: 116
};

// 設定日期選擇器的最大值為今天
document.getElementById('birthdate').max = new Date().toISOString().split('T')[0];

// 切換寵物類型
function switchPet(petType) {
  currentPet = petType;
  
  // 更新按鈕狀態
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-pet="${petType}"]`).classList.add('active');
  
  // 更新頁面內容
  if (petType === 'dog') {
    document.body.classList.remove('cat-mode');
    document.getElementById('petEmoji').textContent = '🐶';
    document.getElementById('petTitle').textContent = '狗狗歲數計算機';
    document.getElementById('petLabel').textContent = '狗狗的出生日期：';
    document.getElementById('petName').textContent = '狗狗';
    document.getElementById('petAgeUnit').textContent = '狗年齡';
    document.getElementById('formulaText').innerHTML = '人類年齡 = 16 × ln(狗年齡) + 31';
    document.getElementById('formulaSource').innerHTML = '此公式基於<a href="https://www.sciencedirect.com/science/article/pii/S2405471220302039" target="_blank" class="info-link">美國加州大學聖地牙哥分校的研究團隊</a>';
  } else {
    document.body.classList.add('cat-mode');
    document.getElementById('petEmoji').textContent = '🐱';
    document.getElementById('petTitle').textContent = '貓貓歲數計算機';
    document.getElementById('petLabel').textContent = '貓貓的出生日期：';
    document.getElementById('petName').textContent = '貓貓';
    document.getElementById('petAgeUnit').textContent = '貓年齡';
    document.getElementById('formulaText').innerHTML = '前2年快速成長，2歲達24歲，之後每年增加4歲';
    document.getElementById('formulaSource').innerHTML = '此公式基於<a href="https://icatcare.org/articles/how-to-tell-your-cats-age-in-human-years?locale=zh_TW" target="_blank" class="info-link">International Cat Care貓貓生命階段的換算方式</a>';
  }
  
  // 隱藏結果
  document.getElementById('result').classList.remove('show');
}

// 貓貓年齡查表函數（改用月份查表）
function getCatHumanAge(ageInMonths) {
  // 直接查表
  if (catMonthTable[ageInMonths] !== undefined) {
    return catMonthTable[ageInMonths];
  }
  
  // 如果不在表格中，找最接近的兩個月份做插值
  const months = Object.keys(catMonthTable).map(Number).sort((a, b) => a - b);
  
  for (let i = 0; i < months.length - 1; i++) {
    if (ageInMonths > months[i] && ageInMonths < months[i + 1]) {
      const ratio = (ageInMonths - months[i]) / (months[i + 1] - months[i]);
      const humanAge = catMonthTable[months[i]] + 
                       ratio * (catMonthTable[months[i + 1]] - catMonthTable[months[i]]);
      return parseFloat(humanAge.toFixed(1));
    }
  }
  
  // 超過最大值（25歲/300個月），按每月增加 4/12 歲計算
  if (ageInMonths > 300) {
    return parseFloat((catMonthTable[300] + (ageInMonths - 300) * (4 / 12)).toFixed(1));
  }
  
  // 如果年齡小於0，回傳0
  return 0;
}

// 計算年齡
function calculateAge() {
  const birthdate = document.getElementById('birthdate').value;
  
  if (!birthdate) {
    alert(`請選擇${currentPet === 'dog' ? '狗狗' : '貓貓'}的出生日期！`);
    return;
  }
  
  const birth = new Date(birthdate);
  const today = new Date();
  
  let petAgeYears;
  let petAgeMonths; // 新增：儲存月齡
  
  if (currentPet === 'dog') {
    // 狗狗：使用精確天數計算（保持原樣）
    const diffTime = Math.abs(today - birth);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    petAgeYears = (diffDays / 365.25).toFixed(1);
  } else {
    // 貓貓：使用整數月份計算
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    const days = today.getDate() - birth.getDate();
    
    let totalMonths = years * 12 + months;
    
    // 如果日期還沒到，月份要減1
    if (days < 0) {
      totalMonths -= 1;
    }
    
    petAgeMonths = totalMonths; // 儲存月齡
    petAgeYears = (totalMonths / 12).toFixed(1); // 顯示用的年齡
  }
  
  let humanAge;
  
  if (currentPet === 'dog') {
    // 狗狗公式
    if (petAgeYears < 0.1) {
      humanAge = 0;
    } else {
      humanAge = 16 * Math.log(parseFloat(petAgeYears)) + 31;
    }
    humanAge = Math.max(0, humanAge).toFixed(1);
  } else {
    // 貓貓公式 - 使用月齡查表
    humanAge = getCatHumanAge(petAgeMonths);
  }
  
  // 顯示結果
  const petAgeDisplay = document.getElementById('petAge');
  const humanAgeDisplay = document.getElementById('humanAge');
  
  if (currentPet === 'dog') {
    petAgeDisplay.textContent = petAgeYears;
    humanAgeDisplay.textContent = humanAge;
  } else {
    // 貓貓顯示月齡或年齡
    if (petAgeMonths < 12) {
      petAgeDisplay.textContent = `${petAgeMonths} 個月`;
    } else {
      const years = Math.floor(petAgeMonths / 12);
      const months = petAgeMonths % 12;
      if (months === 0) {
        petAgeDisplay.textContent = `${years} 歲`;
      } else {
        petAgeDisplay.textContent = `${years} 歲 ${months} 個月`;
      }
    }
    humanAgeDisplay.textContent = `${humanAge} 歲`;
  }
  
  // 顯示生命階段
  displayLifeStage(parseFloat(petAgeYears), parseFloat(humanAge));
  
  // 顯示健康提醒
  displayHealthReminder(parseFloat(petAgeYears));
  
  document.getElementById('result').classList.add('show');
}

// 顯示生命階段
function displayLifeStage(petAge, humanAge) {
  const stageBadge = document.getElementById('stageBadge');
  const stageDescription = document.getElementById('stageDescription');
  
  if (currentPet === 'dog') {
    // 狗狗生命階段（簡化版）
    if (petAge < 1) {
      stageBadge.textContent = '🐕 幼犬期';
      stageDescription.textContent = '快速成長階段，需要充足營養和社會化訓練';
    } else if (petAge < 3) {
      stageBadge.textContent = '🐕 青年期';
      stageDescription.textContent = '精力旺盛，需要大量運動和持續訓練';
    } else if (petAge < 7) {
      stageBadge.textContent = '🐕 成年期';
      stageDescription.textContent = '身心成熟，維持規律運動和均衡飲食';
    } else if (petAge < 10) {
      stageBadge.textContent = '🐕 熟齡期';
      stageDescription.textContent = '開始老化，需要更多健康監測';
    } else {
      stageBadge.textContent = '🐕 老年期';
      stageDescription.textContent = '需要特別照護，定期健檢很重要';
    }
  } else {
    // 貓貓生命階段
    if (petAge < 0.5) {
      stageBadge.textContent = '🐱 幼貓期 (Kitten)';
      stageDescription.textContent = '快速成長學習階段，社會化訓練很重要';
    } else if (petAge < 2) {
      stageBadge.textContent = '🐱 青少年期 (Junior)';
      stageDescription.textContent = '像人類青少年，充滿好奇心和探索慾';
    } else if (petAge < 7) {
      stageBadge.textContent = '🐱 成貓期 (Adult)';
      stageDescription.textContent = '身心成熟，需要規律運動和心智刺激';
    } else if (petAge < 11) {
      stageBadge.textContent = '🐱 熟齡期 (Mature)';
      stageDescription.textContent = '相當於人類中年，活動量開始下降';
    } else if (petAge < 15) {
      stageBadge.textContent = '🐱 老年期 (Senior)';
      stageDescription.textContent = '需要環境調整，如低邊貓砂盆和坡道';
    } else {
      stageBadge.textContent = '🐱 超高齡期 (Super Senior)';
      stageDescription.textContent = '需要密切觀察行為變化，給予特別照護';
    }
  }
}

// 顯示健康提醒
function displayHealthReminder(petAge) {
  const reminderContent = document.getElementById('reminderContent');
  
  if (currentPet === 'dog') {
    if (petAge < 1) {
      reminderContent.innerHTML = `
        <ul>
          <li>完成疫苗接種計畫</li>
          <li>開始社會化訓練</li>
          <li>提供高品質幼犬飼料</li>
        </ul>
      `;
    } else if (petAge < 7) {
      reminderContent.innerHTML = `
        <ul>
          <li>每年定期健康檢查</li>
          <li>維持適當運動量</li>
          <li>注意體重控制</li>
        </ul>
      `;
    } else {
      reminderContent.innerHTML = `
        <ul>
          <li>建議每半年健檢一次</li>
          <li>注意關節和牙齒健康</li>
          <li>調整飲食為老年配方</li>
        </ul>
      `;
    }
  } else {
    if (petAge < 2) {
      reminderContent.innerHTML = `
        <ul>
          <li>完成疫苗和驅蟲</li>
          <li>考慮結紮手術</li>
          <li>提供安全探索環境</li>
        </ul>
      `;
    } else if (petAge < 7) {
      reminderContent.innerHTML = `
        <ul>
          <li>每年定期健康檢查</li>
          <li>維持理想體重</li>
          <li>提供心智刺激玩具</li>
        </ul>
      `;
    } else if (petAge < 11) {
      reminderContent.innerHTML = `
        <ul>
          <li>每年健檢含血液檢查</li>
          <li>注意行為變化</li>
          <li>開始預防性照護</li>
        </ul>
      `;
    } else {
      reminderContent.innerHTML = `
        <ul>
          <li>建議每半年健檢一次</li>
          <li>調整居家環境便利性</li>
          <li>密切觀察食慾和活動力</li>
        </ul>
      `;
    }
  }
}