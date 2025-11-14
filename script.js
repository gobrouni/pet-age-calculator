 // 設定日期選擇器的最大值為今天
    document.getElementById('birthdate').max = new Date().toISOString().split('T')[0];
    
    function calculateAge() {
      const birthdate = document.getElementById('birthdate').value;
      
      if (!birthdate) {
        alert('請選擇狗狗的出生日期！');
        return;
      }
      
      // 計算狗的實際年齡
      const birth = new Date(birthdate);
      const today = new Date();
      const diffTime = Math.abs(today - birth);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const dogAgeYears = (diffDays / 365.25).toFixed(1);
      
      // 使用公式計算人類年齡
      let humanAgeCalc;
      if (dogAgeYears < 0.1) {
        humanAgeCalc = 0;
      } else {
        humanAgeCalc = 16 * Math.log(parseFloat(dogAgeYears)) + 31;
      }
      
      const humanAge = Math.max(0, humanAgeCalc).toFixed(1);
      
      // 顯示結果
      document.getElementById('dogAge').textContent = dogAgeYears;
      document.getElementById('humanAge').textContent = humanAge;
      document.getElementById('result').classList.add('show');
    }