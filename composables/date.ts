

export function useParseDate(timeStamp) {

    const localeCode = useNuxtApp().$i18n.locale

    const d = new Date(timeStamp)

    const date = d.getDate()
    const month = d.getMonth()
    const year = d.getFullYear()

    if(localeCode.value === 'fr') {

        return `${date} ${months[localeCode.value][month].name} ${year}`
    }
    else {
        return `${months[localeCode.value][month].name} ${parseEnglishDate(date) } ${year}`
    }
}

function parseEnglishDate(date) {

    const str = `${date}`

    const lastNum = str.slice(-1)

    if(lastNum === '1') {
        return `${date}st`
    } else if(lastNum === '2') {
        return `${date}nd`
    } else if(lastNum === '3') {
        return `${date}rd`
    } else {
        return `${date}th`
    }
}

const months = {
    en: [
        { name: 'january', short: 'jan' },
        { name: 'february', short: 'feb' },
        { name: 'march', short: 'mar' },
        { name: 'april', short: 'apr' },
        { name: 'may', short: 'may' },
        { name: 'june', short: 'jun' },
        { name: 'july', short: 'jul' },
        { name: 'august', short: 'aug' },
        { name: 'september', short: 'sep' },
        { name: 'october', short: 'oct' },
        { name: 'november', short: 'nov' },
        { name: 'december', short: 'dec' }
    ],
    fr: [
        { name: 'janvier', short: 'janv' },
        { name: 'février', short: 'févr' },
        { name: 'mars', short: 'mars' },
        { name: 'avril', short: 'avr' },
        { name: 'mai', short: 'mai' },
        { name: 'juin', short: 'juin' },
        { name: 'juillet', short: 'juil' },
        { name: 'août', short: 'août' },
        { name: 'septembre', short: 'sept' },
        { name: 'octobre', short: 'oct' },
        { name: 'novembre', short: 'nov' },
        { name: 'décembre', short: 'déc' }
    ]
};