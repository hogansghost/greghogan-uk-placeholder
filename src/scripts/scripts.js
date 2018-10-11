(function() {
  const themePicker = {
    randomNum: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    randomiseTheme: function() {
      let randNum = this.randomNum(0, 6);

      // Call select theme method, supplying the randomly generated theme val.
      this.selectTheme(randNum);
    },
    selectTheme: function(theme) {
      let themeClass = 'theme-one';

      // Convert theme value to string class-name.
      switch(theme) {
        case 1:
          themeClass = 'theme-one';
          break;
        case 2:
          themeClass = 'theme-two';
          break;
        case 3:
          themeClass = 'theme-three';
          break;
        case 4:
          themeClass = 'theme-four';
          break;
        case 5:
          themeClass = 'theme-five';
          break;
        case 6:
          themeClass = 'theme-six';
          break;
        default:
          themeClass = '';
          break;
      }
      
      // Call apply theme method.
      this.addTheme(themeClass);
    },
    addTheme: function(themeClass) {
      let htmlClassList = document.querySelector('html').classList;
      let htmlClassArray = [... htmlClassList];

      // Remove any theme classes already applied.
      let themesToRemove = htmlClassArray.slice(' ').filter((className) => className.includes('theme-'));

      themesToRemove.forEach((className) => {
        htmlClassList.remove(className);
      });

      // Check if theme "exists" and apply respectfully.
      if( themeClass !== '' ) {
        htmlClassList.add(themeClass);
      }
    },
    init: function() {
      this.randomiseTheme();
    }
  };

  themePicker.init();
})();

(function() {
  const quoteTime =  1535569397866;

  function calculateTimeSincePosted(dateNow=(new Date())) {
    const authorDate = new Date(quoteTime);
    const authorDateUTC = Date.UTC(
      authorDate.getFullYear(), 
      authorDate.getMonth(), 
      authorDate.getDate(),
      authorDate.getHours(),
      authorDate.getMinutes(),
      authorDate.getSeconds()
      );

    let currentDate = dateNow;
    let currentDateUTC = Date.UTC(
      currentDate.getFullYear(), 
      currentDate.getMonth(), 
      currentDate.getDate(), 
      currentDate.getHours(), 
      currentDate.getMinutes(), 
      currentDate.getSeconds()
      );

      // Calculate the remaining duration for each time segment.
      let durationPassed = Math.abs((currentDateUTC - authorDateUTC) / 1000);
      let durationDays    = Math.floor(durationPassed / (3600 * 24));
      let durationHours   = Math.floor((durationPassed - (durationDays * (3600 * 24)))/3600);
      let durationMinutes = Math.floor((durationPassed - (durationDays * (3600 * 24)) - (durationHours * 3600)) / 60);
      let durationSeconds = Math.floor(durationPassed - (durationDays * (3600 * 24)) - (durationHours * 3600) - (durationMinutes * 60));


      // Fix duration value to 0 prefix if required, converting to string. Looks nicer.
      if( durationDays < 10 ) {
        durationDays = `0${durationDays}`;
      }
      
      if( durationHours < 10 ) {
        durationHours = `0${durationHours}`;
      }
      
      if( durationMinutes < 10 ) {
        durationMinutes = `0${durationMinutes}`;
      }
      
      if( durationSeconds < 10 ) {
        durationSeconds = `0${durationSeconds}`;
      }
      
      // Apply to respective inDOM elements.
      document.querySelector('.passed-duration-days .passed-duration-value__amount').innerHTML = durationDays;
      document.querySelector('.passed-duration-hours .passed-duration-value__amount').innerHTML = durationHours;
      document.querySelector('.passed-duration-minutes .passed-duration-value__amount').innerHTML = durationMinutes;
      document.querySelector('.passed-duration-seconds .passed-duration-value__amount').innerHTML = durationSeconds;
    }

    function getDateString(date) {
      if( !date ) {
        return '1st';
      }

      let dateLastDigit = `${date}`.slice(-1);

      if( dateLastDigit === '1' ) {
        return `${date}st`;
      } else if( dateLastDigit === '2' ) {
        return `${date}nd`;
      } else if( dateLastDigit === '3' ) {
        return `${date}rd`;
      } else {
        return `${date}th`;
      }
    }

    function getMonthString(month) {
      let monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      if( month < 0 || month > 12 ) {
        month = 0;
      }

      return monthList[month];
    }

    function setQuoteDateString() {
      let quoteDate = new Date(quoteTime);
      let dateOutputDate = getDateString(quoteDate.getUTCDate());
      let dateOutputMonth = getMonthString(quoteDate.getUTCMonth());
      let dateOutputYear = quoteDate.getUTCFullYear();

      document.querySelector('.js__quote-date').innerHTML = `${dateOutputDate} ${dateOutputMonth} ${dateOutputYear}`;
    }

    function init() {
      setQuoteDateString();
      calculateTimeSincePosted();
    }


  // Initial call.
  init();

  // Apply to call and update every second, tick, tock.
  window.timeInterval = setInterval(calculateTimeSincePosted, 1000);
})(window);
