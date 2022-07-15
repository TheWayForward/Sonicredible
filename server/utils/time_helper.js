class TimeHelper {

    static captcha_expires = 1000 * 60 * 5;

    static format_number(n) {
        n = n.toString();
        return n[1] ? n : "0" + n;
    }

    static convert_date_to_date_string(date) {
        return `${date.getFullYear()}/${this.format_number(date.getMonth() + 1)}/${this.format_number(date.getDate())}`;
    }

    static convert_date_to_time_string(date) {
        return `${this.format_number(date.getHours())}:${this.format_number(date.getMinutes())}:${this.format_number(date.getSeconds())}`;
    }

    static convert_date_to_date_time_string(date) {
        return `${this.convert_date_to_date_string(date)} ${this.convert_date_to_time_string(date)}`;
    }

    static format_time(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();

        function day_to_ch() {
            switch (date.getDay()) {
                case (0):
                    return "星期日";
                case (1):
                    return "星期一";
                case (2):
                    return "星期二";
                case (3):
                    return "星期三";
                case (4):
                    return "星期四";
                case (5):
                    return "星期五";
                case (6):
                    return "星期六";
                default:
                    return false;
            }
        }
        return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            second: second,
            weekday: date.getDay(),
            day_to_ch: day_to_ch,
            //formated date, time, and date_time
            date: [year, month, day].map(this.format_number).join('-'),
            time: [hour, minute, second].map(this.format_number).join(':'),
            //full string with padstart
            date_time: [year, month, day].map(this.format_number).join('-') + ' ' + [hour, minute, second].map(this.format_number).join(':'),
            precise_time: date.getTime(),
        };
    }

}

module.exports = TimeHelper;