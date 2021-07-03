import React from 'react';

//const imgUrl = 'https://dmitrykalko.github.io/rakovich/base/images/';
const PreView = (props) => {

	const { lastName, flagName, imgId } = props.selectedItem;
	const { fio, date, showStatus, onClick } = props;

	return (
		<div
			className="preView"
			style={showStatus === true ? { display: 'flex' } : { display: 'none' }}
		>
			<div className="pre-close" onClick={onClick}></div>
			<div className="preSertificate">
				<h1 className='pre-title'>Грамота Шляхтича</h1>
				<img className="pre-flagForPdf" src={process.env.PUBLIC_URL + '/images/' + imgId + '.png'} alt="flagImage" />
				<h4 className='pre-firstString'>Настоящая грамота удостоверяет, что</h4>
				<h2 className='pre-fio'>{fio}</h2>
				<h4 className='pre-secondString'>принадлежит к шляхецкому роду</h4>
				<h2 className='pre-familyName'>«{lastName}»</h2>
				<h4 className='pre-thirdString'>с родовым гербом</h4>
				<h2 className='pre-familyFlag'>«{flagName}»</h2>
				<p className="pre-datePdf">{date}</p>
			</div>
		</div>

	);
}


export default PreView;