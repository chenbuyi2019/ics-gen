// 使用的库是 https://github.com/yize/solarlunar

/**
 * 农历公历互转的日期结果
 */
interface SolarLunarResult {
    /**
     * 农历年
     */
    lYear: number
    /**
     * 农历月
     */
    lMonth: number
    /**
     * 农历日
     */
    lDay: number
    /**
     * 生肖中文名称
     */
    animal: string
    /**
     * 农历月中文名称，如果为闰月，则会在月份前增加 闰 字
     */
    monthCn: string
    /**
     * 农历日中文名称
     */
    dayCn: string
    /**
     * 农历年份的中文名字
     */
    yearCn: string
    /**
     * 公历年
     */
    cYear: number
    /**
     * 公历月
     */
    cMonth: number
    /**
     * 公历日
     */
    cDay: number
    /**
     * 年的农历叫法（干支）
     */
    gzYear: string
    /**
     * 月的农历叫法（干支）
     */
    gzMonth: string
    /**
     * 日的农历叫法(干支)
     */
    gzDay: string
    /**
     * 是否是今天
     */
    isToday: boolean
    /**
     * 是否是闰月
     */
    isLeap: boolean
    /**
     * 周几，0表示星期天
     */
    nWeek: number
    /**
     * 中文周几
     */
    ncWeek: string
    /**
     * 是否有节气
     */
    isTerm: boolean
    /**
     * 节气的名字，如果没有则返回空字符串
     */
    term: string

}

/**
 * 农历公历互转
 */
const solarlunar = {
    /**
     * 输入公历年月日，得到日期结果
     */
    solar2lunar: function (year: number, m: number, d: number): SolarLunarResult | -1 { },

    /**
     * 输入农历年月日，以及是否为闰月，得到日期结果
     */
    lunar2solar: function (year: number, m: number, d: number, isLeap: boolean): SolarLunarResult | -1 { },

    /**
     * 返回农历某年的总天数
     */
    lYearDays: function (y: number): number { },

    /**
     * 返回农历 y 年闰月是哪个月；若 y 年没有闰月 则返回 0
     */
    leapMonth: function (y: number): number { },

    /**
     * 返回农历 y 年闰月的天数，若该年没有闰月则返回 0
     */
    leapDays: function (y: number): number { },

    /**
     * 返回农历 y 年 m 月（非闰月）的天数
     */
    monthDays: function (y: number, m: number): number { },

    /**
     * 返回公历 y 年 m 月的天数
     */
    solarDays: function (y: number, m: number): number { },

    /**
     * 传入农历数字月份，返回汉语通俗表示法，比如12会返回腊月
     */
    toChinaMonth: function (m: number): string { },

    /**
     * 传入农历日期数字，返回汉字表示法，比如22是廿二
     */
    toChinaDay: function (d: number): string { },
}
