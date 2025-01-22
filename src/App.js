import React, {useEffect} from 'react';
import './App.css';
// import Main from './components/main';

function App() {
  useEffect(() => {
    window.sessionStorage.setItem('foo', 'bar');
    window.sessionStorage.setItem('item1', 'cat');
    window.localStorage.setItem('item2', 'dog');
    window.localStorage.setItem('item3', 'fish');
    window.addEventListener('message', function(event){
      console.log('incoming from iframe?', event, event.data);
    });

    // Cleanup the listener when the component unmounts
    return () => {
      window.removeEventListener('message', () => {});
    };
  }, []); // Empty dependency array means this effect runs once on mount
  console.log('from parent...', window.localStorage.getItem('item1'));
  return (
    <div className="App">
      <iframe 
      // sandbox='allow-storage-access-by-user-activation allow-scripts allow-same-origin'
        width={window.innerWidth - 100} height={window.innerHeight - 100} title='iframe example' src="http://localhost:3001/pokemon-search#token=123456789" />
    </div>
  );
}

export default App;
