/**
 * 日历文件
 */
class VCalendar {
    constructor() {
    }
    
    /**
     * 日历文件制作者 PRODID
     */
    ProductorId: string = 'buyi.dev'

    /**
     * 日历事件
     */
    readonly Events: VEvent[] = []

    toString(): string {
        let out = `BEGIN:VCALENDAR\nVERSION:2.0\n`
        out += `PRODID:${VEvent.cleanString(this.ProductorId)}\n`
        for (const e of this.Events) {
            out += e.toString() + "\n"
        }
        out += `END:VCALENDAR`
        return out
    }

}

/**
 * 日历事件
 */
class VEvent {
    constructor(summary: string, dt: Date) {
        this.Summary = summary
        this.Date = dt
        this.UID = (Math.random() * 99999559 + 10055014).toFixed() + dt.getTime().toFixed()
    }

    /**
     * 标题 SUMMARY
     */
    Summary: string

    /**
     * 描述 DESCRIPTION
     */
    Description: string = ''

    /**
     * 日期 DTSTART 和 DTEND
     */
    Date: Date

    /**
     * 全局唯一ID，随机生成一个
     */
    UID: string

    /**
     * 是否每年公历重复一次
     */
    YearlyRepeat: boolean = false

    /**
     * 清理字符串内的奇怪字符
     */
    static cleanString(s: string): string {
        return s.replaceAll("\t", " ").replaceAll(/[\r\n]+/g, " ").replaceAll(";", "_").trim()
    }

    /**
     * 获取标准格式的日期字符串 20230117
     */
    static getDateString(dt: Date): string {
        return `${dt.getFullYear()}${(dt.getMonth() + 1).toFixed().padStart(2, '0')}${dt.getDate().toFixed().padStart(2, '0')}`
    }

    toString(): string {
        let out = `BEGIN:VEVENT\nUID:${VEvent.cleanString(this.UID)}\n`
        out += `SUMMARY:${VEvent.cleanString(this.Summary)}\n`
        out += `DESCRIPTION:${VEvent.cleanString(this.Description)}\n`
        let dt = VEvent.getDateString(this.Date)
        out += `DTSTART;VALUE=DATE:${dt}\n`
        out += `DTEND;VALUE=DATE:${dt}\n`
        if (this.YearlyRepeat) {
            out += `RRULE:FREQ=YEARLY;INTERVAL=1;\n`
        }
        out += `END:VEVENT`
        return out
    }

}