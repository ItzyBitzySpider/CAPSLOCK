export default function MElimination() {
    
	const fakeData = [
		'1',
		'2',
		'3',
		'4',
		'5',
		'1',
		'2',
		'3',
		'4',
		'5',
		'1',
		'2',
		'3',
		'4',
		'5',
		'1',
		'2',
		'3',
		'4',
		'5',
	];
	return (
		<div className='main-content'>
			<div className='rounded w-4/5 h-3/5 grid grid-cols-5 grid-rows-4'>
				{fakeData.map((val) => {
					return <div className='text-center text-lg'>{val}</div>;
				})}
			</div>
			<br />
			<br />
			<br />
			<div>
				<input
					placeholder='Type here'
					className='bg-slate-100 w-96 text-xl text-neutral-700 rounded px-3 p-2 focus:outline-none'
				/>
			</div>
		</div>
	);
}
