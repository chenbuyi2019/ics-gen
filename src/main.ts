const txtInput = document.getElementById('txtInput') as HTMLTextAreaElement
const txtYearCount = document.getElementById('txtYearCount') as HTMLInputElement
const butGenSolar = document.getElementById('butGenSolar') as HTMLButtonElement
const butGenLunar = document.getElementById('butGenLunar') as HTMLButtonElement
const txtTitleSuffix = document.getElementById('txtTitleSuffix') as HTMLInputElement
const checkAddLunarDateAfterTitle = document.getElementById('checkAddLunarDateAfterTitle') as HTMLInputElement

txtInput.value = `1-1 春节
12-30 除夕
5-30 一个生日`

const maxYear: number = 2098
const thisYear = Math.min(Math.max(new Date().getFullYear(), 2023), maxYear)

/**
 * 输入农历的年月日来获取公历结果，但是假如是农历30日不存在，就退到农历29日那一天。
 */
function getLunarCalendarResult(y: number, m: number, d: number): SolarLunarResult | null {
    for (let index = 0; index < 6; index++) {
        let r = solarlunar.lunar2solar(y, m, d - index, false)
        if (typeof r == 'object') { return r }
    }
    return null
}

function getDateFromLunarResult(r: SolarLunarResult): Date {
    let dt = new Date
    dt.setHours(0, 0, 0, 0)
    dt.setFullYear(r.cYear, r.cMonth - 1, r.cDay)
    return dt
}

const regEventFormat: RegExp = /([0-9]{1,2})-([0-9]{1,2})\s+(.+)/i

function processICS(useLunarCalendar: boolean): void {
    butGenLunar.disabled = true
    butGenSolar.disabled = true
    try {
        const txt = txtInput.value.trim()
        if (txt.length < 3) { throw '输入为空白' }
        const endYear = Math.max(txtYearCount.valueAsNumber, 1) + thisYear - 1
        if (endYear > maxYear) { throw `已经超过最大工作年份 ${endYear}` }
        const suffix = txtTitleSuffix.value
        const addLunarDateAfterTitle = checkAddLunarDateAfterTitle.checked
        const lines = txt.split(/[\n\r]+/g)
        const usedText: string[] = []
        const ical = new VCalendar()
        const bigMonths = [1, 3, 5, 7, 8, 10, 12]
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index].trim()
            if (line.length < 1) { continue }
            try {
                const mc = regEventFormat.exec(line)
                if (mc == null) { throw `格式无法识别` }
                const month = parseInt(mc[1])
                if (month < 1 || month > 12) { throw `月份不对` }
                const date = parseInt(mc[2])
                if (date < 1 || date > 31) { throw `日数不对` }
                if (useLunarCalendar) {
                    if (date > 30) { throw `农历一个月最多30天` }
                } else {
                    if (date > 28) {
                        if (month == 2) { throw '在这里2月只能标到28号' }
                        if (date == 31 && !bigMonths.includes(month)) { throw `${month}月没有31日` }
                    }
                }
                let text = mc[3].trim()
                if (text.length < 1 || text.length > 99) { throw '事件标题空白或太长' }
                text += suffix
                if (useLunarCalendar) {
                    const dateZh = `${solarlunar.toChinaMonth(month)}${solarlunar.toChinaDay(date)}`
                    if (addLunarDateAfterTitle) {
                        text += `（${dateZh}）`
                    }
                    if (usedText.includes(text)) { throw '事件标题重复使用' }
                    usedText.push(text)
                    for (let year = thisYear; year <= endYear; year++) {
                        const result = getLunarCalendarResult(year, month, date)
                        if (result == null) { throw `无法计算农历 ${year}年${month}月${date}日 的公历结果 ` }
                        const dt = getDateFromLunarResult(result)
                        const ev = new VEvent(text, dt)
                        if (!addLunarDateAfterTitle) {
                            ev.Description = dateZh
                        }
                        ical.Events.push(ev)
                    }
                } else {
                    const dt = new Date()
                    dt.setHours(0, 0, 0, 0)
                    dt.setFullYear(thisYear, month - 1, date)
                    const ev = new VEvent(text, dt)
                    ev.YearlyRepeat = true
                    ical.Events.push(ev)
                }
            } catch (error) {
                throw `第 ${index + 1} 行：${error}\n${line}`
            }
        }
        const ak = document.createElement('a')
        ak.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(ical.toString())}`
        ak.download = `${((new Date).getTime() / 1000).toFixed()}.ics`
        ak.style.display = 'none'
        document.body.appendChild(ak)
        ak.click()
        ak.remove()
    } catch (error) {
        alert(`错误：\n${error}`)
    }
    setTimeout(function () {
        butGenLunar.disabled = false
        butGenSolar.disabled = false
    }, 600)
}

butGenLunar.addEventListener('click', function () {
    processICS(true)
})

butGenSolar.addEventListener('click', function () {
    processICS(false)
})
