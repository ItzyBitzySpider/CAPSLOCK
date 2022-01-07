export default function Singleplayer(){
    return <div className="main-content">
        <h1 className="text-5xl">Select Gamemode</h1>
        <br/><br/>
        <button className='text-3xl hover:font-medium'>Elimination</button>
        <button className='text-3xl hover:font-medium py-5'>Attack & Defense</button>
        <button className='text-3xl hover:font-medium'>Survival</button>
    </div>;
}