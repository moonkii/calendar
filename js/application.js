var id = '1pfzc70xgL0Ge89nfbxk06kXq1TqqY0X3gKE8kJ_emDg';
var url = 'https://spreadsheets.google.com/feeds/list/' + id + '/od6/public/values?alt=json';

axios.get(url)
  .then(function(response) {
    var items = response.data.feed.entry;
    var events = items.map(function(row) {
      var date = moment(row['gsx$date'].$t, 'YYYY. MM. DD');
      var author = row['gsx$author'].$t;
      var title = row['gsx$title'].$t;
      var url = row['gsx$url'].$t;
      if (!date.isValid() || !title) {
        return null;
      }
      url = url.match(/^http/) ? url : '';
      return {
        start: date.format('YYYY-MM-DD'),
        title: '[' + author + '] ' + title + (url ? '' : ' [예약]'),
        url: url
      };
    }).filter(function(event) { return event != null; });

    var element = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(element, {
      defaultDate: moment().format(),
      events: events,
      eventClick: function(info) {
        info.jsEvent.preventDefault();
        if (info.event.url) {
          window.open(info.event.url);
        }
      }
    });
    calendar.render();
  })
  .catch(function(error) {
    alert(error);
  });
