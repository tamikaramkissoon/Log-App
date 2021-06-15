const server = 'https://exercise-js.snickdx.repl.co';

      document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems);
        getLogs();
      });

      async function sendRequest(url, method, data) {
        const options = { method };
        if (data) {
          options.body = JSON.stringify(data);
          options.headers = { 'Content-Type': 'application/json' };
        }
        let response = await fetch(server + url, options);
        return response.json();
      }

      async function createLog(event) {
        event.preventDefault();

        //Getting data from form
        const form = event.target;                //1. Get form
        const formData = new FormData(form);      //2. Create FormData object
        const data = Object.fromEntries(formData);//3. Create json object

        //It is important to await here so the data is sent before we reload the table 
        await sendRequest('/api/logs', 'POST', data);

        //Reload the table 
        getLogs();
      }

      async function getLogs() {
        const logs = await sendRequest('/api/logs', 'GET');
        displayLogs(logs);
      }
      // Drawing table on the dom
      function displayLogs(logs) {
        let html = '';
        for (let log of logs) {
          html += `<tr>
                        <td>${log.id}</td>
                        <td>${log.studentId}</td>
                        <td>${log.created}</td>
                        <td>${log.stream}</td>
                        <td>
                          <a class="waves-effect waves-light btn" onclick="deleteLog(${log.id})" href="#logsTable">DELETE</a>
                        </td>
                  </tr>`;
        }
        document.querySelector('#logsTable').innerHTML = html;
      }
      // creates the delete function
      async function deleteLog(id) {
        await sendRequest(`/api/logs/${id}`, 'DELETE');
        getLogs();
      }