import { useState, useEffect } from 'react';
import './App.scss';
import { OpenAIApi, Configuration } from 'openai'; 

console.log(process.env.REACT_APP_API_KEY)

// openai.api_key = os.environ["OPENAI_API_KEY"]
function App() {
  const [data, setdata] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const submitHandle = async (e) => {
    e.preventDefault();
    const formdeets = new FormData(e.target),
      formdeetsobj = Object.fromEntries(formdeets.entries());
    // API

    debugger;
    const configuration = new Configuration({
    apiKey: `${process.env.REACT_APP_API_KEY}`,
    });
    const openAi = new OpenAIApi(configuration);
    setisLoading(true);
    await openAi
      .createCompletion('text-curie-001', {
        prompt: `${formdeetsobj.prompt}`,
        temperature: 0.8,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((response) => {
        setdata([
          {
            prompt: `${formdeetsobj.prompt}`,
            response: `${response.data.choices[0].text}`,
            id: data.length,
          },
          ...data,
        ]);
      });
    setisLoading(false);
  };
  //storing responses locally
  useEffect(() => {
    const storedata = localStorage.getItem('data');
    if (storedata) {
      setdata(JSON.parse(storedata));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(data))
  }, [data]);  

  return (
    <div id='App' >
      <div className='d-flex flex-row align-items-center'>
        <nav className='mt-3 me-auto py-1 px-2'>OPEN AI</nav>
        <div className='githubBtn '>
        
        </div>
      </div>
      <div className='container'>
        <div className='d-flex flex-column col-12 mx-auto col-md-8 my-4'>
          <header className='fs-2 mb-2'>Let's have fun with an AI</header>
          <p className=''>
            OpenAI’s API provides access to GPT-3, which performs a wide variety
            of natural language tasks, and Codex, which translates natural
            language to code.
          </p>
          {isLoading ? (
            <p className='text-center fs-2'>Loading...</p>
          ) : (
            <form
              action=''
              onSubmit={submitHandle}
              className='d-flex flex-column'>
              <label className='mb-2 fs-6'>Enter prompt</label>
              <textarea name='prompt' cols='30' rows='10'></textarea>
              <button className='submit ms-auto mt-3 py-1 px-3' type='submit'>
                Submit
              </button>
            </form>
          )}

          {/* Responses */}
          {data &&
            data.map((data) => {
              return (
                <div className='p-2 card mt-3' key={data.id}>
                  <div className='flex-row d-flex mb-3'>
                    <h4 className='col-3'>Prompt:</h4>
                    <p className='col-9'>{data.prompt}</p>
                  </div>
                  <div className='flex-row d-flex'>
                    <h4 className='col-3'>Response:</h4>
                    <p className='col-9'>{data.response}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
