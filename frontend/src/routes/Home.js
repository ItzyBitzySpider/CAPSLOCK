import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className='main-content'>
			<h1 className='text-7xl font-bold'>CAPSLOCK</h1>
			<div className='flex flex-row p-7'>
				<button className="w-56">
					<Link to='/singleplayer' className="text-3xl hover:font-medium">Single Player</Link>
				</button>
                <h2 className="text-4xl">|</h2>
				<button className="w-56">
					<Link to='/multiplayer' className='text-3xl hover:font-medium'>Multiplayer</Link>
				</button>
			</div>
		</div>
	);
}
