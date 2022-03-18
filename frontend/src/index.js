import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './routes/Home';
import Singleplayer from './routes/Singleplayer';
import Multiplayer from './routes/Multiplayer';
import SAttackDefense from './routes/singleplayer/AttackDefense';
import SElimination from './routes/singleplayer/Elimination';
import SSurival from './routes/singleplayer/Survival';
import MAttackDefense from './routes/multiplayer/AttackDefense';
import MElimination from './routes/multiplayer/Elimination';
import MSurvival from './routes/multiplayer/Survival';
import reportWebVitals from './reportWebVitals';
import Join from './routes/multiplayer/Join';

ReactDOM.render(
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/singleplayer' element={<Singleplayer />} />
			<Route path='/singleplayer/elimination' element={<SElimination />} />
			<Route path='/singleplayer/attackdefense' element={<SAttackDefense />} />
			{/* <Route path='/singleplayer/survival' element={<SSurival />} /> */}
			<Route path='/multiplayer' element={<Multiplayer />} />
			<Route path='/multiplayer/join' element={<Join />} />
			<Route path='/multiplayer/elimination' element={<MElimination />} />
			<Route path='/multiplayer/attackdefense' element={<MAttackDefense />} />
			{/* <Route path='/multiplayer/survival' element={<MSurvival />} /> */}
		</Routes>
	</BrowserRouter>,
	document.getElementById('root')
);

reportWebVitals();
