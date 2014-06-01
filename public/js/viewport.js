if(screen.width < 750) {
    viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=750');
}
if(screen.width > 750) {
    viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=1024');
}