import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Multiplayer() {
	const [roomCode, setRoomCode] = useState('');
	return (
		<div className='main-content'>
			<h1 className='text-5xl'>Select Gamemode</h1>
			<br />
			<br />
			<Link
				to='/multiplayer/elimination'
				className='text-3xl hover:font-medium'>
				Elimination
			</Link>
			<Link
				to='/multiplayer/attackdefense'
				className='text-3xl hover:font-medium py-5'>
				Attack & Defense
			</Link>
			{/* <button className='text-3xl hover:font-medium'>Survival</button> */}
			<br />
			<div className='flex flex-row items-center'>
				<div className='w-32 h-0.5 bg-neutral-400' />
				<span className='text-xl text-neutral-400'>&emsp;or&emsp;</span>
				<div className='w-32 h-0.5 bg-neutral-400' />
			</div>
			<br />
			<div className='flex flex-row '>
				<input
					className='px-3 w-64 h-10 text-black relative rounded border-0 shadow outline-none focus:outline-none focus:ring'
					placeholder='Enter Room Code'
					onChange={(e) => setRoomCode(e.target.value)}
				/>
				<Link
					className='h-full w-full'
					to='/multiplayer/join'
					state={{ from: 'multiplayer', roomId: roomCode }}>
					<button
						className='rounded ml-2 border-2 border-slate-200 w-10 h-10 hover:border-white hover:font-black '
						onClick={console.log(roomCode)}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-6 w-full rotate-180'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
							/>
						</svg>
					</button>
				</Link>
			</div>
		</div>
	);
}
