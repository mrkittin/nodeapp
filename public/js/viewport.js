if(window.innerWidth < 750) {
    viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=750');
}
if(window.innerWidth > 750) {
    viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=1024');
}