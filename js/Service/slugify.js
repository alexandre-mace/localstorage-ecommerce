function slugify(text, separator){
    return text.toString().toLowerCase()
        .replace(/\s+/g, separator)           // Replace spaces with -
        .replace(/[^a-z0-9]/gi, '')       // Remove all non-word chars
        .replace(/\-\-+/g, separator)         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}
export {slugify};