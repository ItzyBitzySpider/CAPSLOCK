import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Singleplayer() {
	return (
		<div className='main-content'>
			<h1 className='text-5xl text-center font-medium'>Select Gamemode</h1>
			<br />
			<br />
			<Link
				to='/singleplayer/elimination'
				className='text-3xl hover:font-medium'>
				Elimination
			</Link>
			<Link
				to='/singleplayer/attackdefense'
				className='text-3xl hover:font-medium py-5'>
				Attack & Defense
			</Link>
		</div>
	);
}
