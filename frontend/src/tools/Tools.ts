import type { School } from "../interfaces/School";

export function slug(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^a-z0-9\s\u00c0-\u017F-]/gu, '')
        .replace(/:/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/ /g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/--+/g, '-');
}

export function getCookie(name: string): string | null {
    let cookieValue: string | null = null;

    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
                break;
            }
        }
    }

    return cookieValue;
}

export function formatarDataHora(dataIso: Date | string): string {
    function isToday(date: Date): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const secondDate = date;
        secondDate.setHours(0, 0, 0, 0);

        if (today.getDate() === secondDate.getDate()) return true;

        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isToday(new Date(dataIso))) return "Hoje."

    const data = new Date(dataIso);
        
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `Em ${dia}/${mes}/${ano} - ${horas}h${minutos}`;
};

export function getSchoolName(school: string | number | null | undefined, schools: Pick<School, "id" | "name">[]): string {
    const value = school == null ? "" : String(school).trim();
    if (!value) return "";
    const match = schools.find(item => String(item.id) === value);
    if (match) return match.name;
    return /^\d+$/.test(value) ? "" : value;
}
