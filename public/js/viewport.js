if(screen.width < 760) {
    viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=768');
}
if(screen.width > 760) {
    viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=1024');
}