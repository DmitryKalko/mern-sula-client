import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils, {
    formatDate,
    parseDate,
} from 'react-day-picker/moment';
import 'moment/locale/ru';
import './App.css';


const Form = (props) => {
    const { formStatus, onClick, onChangeFio, onChangeEmail, preView, onSubmit, dateChanged, date } = props;
    
    return (
        
        <form
            className="form"
            style={formStatus === true ? { display: 'flex' } : { display: 'none' }}
            onSubmit={onSubmit}
        >
            <div
                className="close"
                onClick={onClick}
            >
            </div>
            <input
                className="fioField"
                placeholder="Фамилия Имя Отчество"
                name="fio"
                onChange={onChangeFio}
            />
            <input
                className="emailField"
                placeholder="Адрес электронной почты"
                name="email"
                onChange={onChangeEmail}
            />
            <DayPickerInput
                inputProps={{ className: 'dateField' }}
                onDayChange={day => dateChanged(day)}
                name='date'
                formatDate={formatDate}
                parseDate={parseDate}
                format="LL"
                value={date}
                dayPickerProps={{
                    locale: 'ru',
                    localeUtils: MomentLocaleUtils,
                }}
            />
            <button className="viewBtn" onClick={preView}>Посмотреть</button>
            <button className='formBtn'>Получить сертификат</button>
        </form>
    );
}

export default Form;