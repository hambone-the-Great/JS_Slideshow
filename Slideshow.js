 /**
 * A cool class for creating a slideshow. 
 */
class Slideshow 
{       
    #container = null
    #slideElements = null; 
    #startingSlide = 0; 
    #animationDuration = 15;
    #pauseDuration = 5000;
    #animationType = "fade"; 
    #moveImages = true;
    #slideCollection = [];
    #cancel = false; 
    #currentSlideIndex = null; 
    /*#currentStep = null; */
    #showControls = false; 
    #backgroundColor = "#fff";


    get Container(){
        return this.#container;
    } 

    set Container(v){
        this.#container = v; 
    }

    get SlideElements() {
        return this.#slideElements; 
    }

    set SlideElements(v){
        this.#slideElements = v; 
    }

    get StartingSlide(){
        return this.#startingSlide;
    }

    set StartingSlide(v) {
        this.#startingSlide = ((v > -1) && (v < this.#slideElements.length)) ? v : 0;
    }

    get AnimationDuration() {
        return this.#animationDuration; 
    }

    set AnimationDuration(v){
        this.#animationDuration = v;
    }

    get PauseDuration(){
        return this.#pauseDuration;
    }

    set PauseDuration(v){
        this.#pauseDuration = v; 
    }

    get AnimationType(){
        return this.#animationType;
    }

    set AnimationType(v){
        this.#animationType = v; 
    }

    get MoveImages(){
        return this.#moveImages; 
    }
    set MoveImages(v){
        this.#moveImages = v; 
    }

    get SlideCollection() {
        return this.#slideCollection;
    }

    set SlideCollection(v) {
        this.#slideCollection = v; 
    }

    get Cancel(){
        return this.#cancel; 
    }

    set Cancel(v){
        this.#cancel = v; 
    }

    //get CurrentStep(){
    //    return this.#currentStep;
    //}

    //set CurrentStep(v){
    //    this.#currentStep = v; 
    //}

    get CurrentSlideIndex(){
        return this.#currentSlideIndex;
    }

    set CurrentSlideIndex(v){
        this.#currentSlideIndex = v;
    }

    get ShowControls(){
        return this.#showControls; 
    }

    set ShowControls(v){
        this.#showControls = v; 
    }    

    get BackgroundColor() {
        return this.#backgroundColor; 
    }

    set BackgroundColor(v) {
        this.#container.style.backgroundColor = v; 
        this.#backgroundColor = v; 
    }



   
    /**
     * The slideshow constructor! :-) Woot! 
     * @param {string} id //The ID of the Slideshow wrapper (div) element. 
     */
    constructor(id)
    {    
        let el = document.getElementById(id); 
        if (!el) {            
            el = document.createElement("div"); 
            el.id = id;
            el.classList.add("slideshow");
            document.appendChild(div);         
        }        

        this.#container = el;

        this.#slideElements = el.children;

        if (this.#slideCollection.length <= 0) {

            let randStr = Slideshow.#MakeId(6); 

            for (let i = 0; i < this.#slideElements.length; i++) {

                let el = this.#slideElements[i];
                let cssClasses = el.classList.toString();

                let slide = new Slide();
                slide.ParentSlideshow = this;
                slide.Id = "slide_" + randStr + "_" + i;
                slide.Element = el;
                slide.CssClass = cssClasses;
                slide.Animation1 = slide.FadeIn;
                slide.Animation2 = slide.FadeOut;
                slide.Width = this.#container.offsetWidth + "px";
                slide.Height = this.#container.offsetHeight + "px";
                              

                if (el.style.backgroundImage) {
                    let bgValue = el.style.backgroundImage;
                    let imgUrl = bgValue.split('url("')[1];
                    imgUrl = imgUrl.split('")')[0];
                    slide.ImageUrl = imgUrl;
                }

                slide.Element.style.background = "url(" + slide.ImageUrl + ")";
                slide.Element.style.backgroundRepeat = "no-repeat";
                slide.Element.style.backgroundPosition = slide.ImagePosition;
                slide.Element.style.backgroundSize = slide.ImageSize;
                slide.Element.style.width = slide.Width;
                slide.Element.style.height = slide.Height;

                
                this.#slideCollection.push(slide);
            }
        }
    }

        

    /**
     * Adds the slide to the to the slideshow container. 
     * Sets the background image, position, and size of the slide.
     * @param {Slide} slide //A slide from the Slide class. 
     */
    AddSlide(slide)
    {        
        this.Container.appendChild(slide.Element);
        slide.Element.style.background = "url(" + slide.ImageUrl + ")";
        slide.Element.style.backgroundRepeat = "no-repeat";
        slide.Element.style.backgroundPosition = slide.ImagePosition;
        slide.Element.style.backgroundSize = slide.ImageSize;
        slide.Element.style.width = slide.Width;
        slide.Element.style.height = slide.Height;
        slide.ParentSlideshow = this; 
        this.#slideCollection.push(slide); 
    }

    /**
     * 
     * @param {Array} slides //An array of slides. 
     */
    AddSlides(slides) 
    {
        
        for (var slide in slides) {
            this.AddSlide(slides[slide]);            
        }

    }
    
    /**
     * Let's start the show! 
     */
    Start() 
    {              
        let startPos;

        if (this.#startingSlide >= 0) {
            startPos = this.#startingSlide;
        }
        else {
            startPos = Math.floor(Math.random() * this.#slideCollection.length);
        }

        if (this.#showControls) {
             this.CreateControls();
        }

        if (this.#backgroundColor){
            this.#container.style.backgroundColor = this.#backgroundColor;
        }

        Slideshow.LoopSlideshow(this, startPos);

    }

    static LoopSlideshow(slideshow, i) {        

        if (!i) i = 0; 

        if (i >= slideshow.SlideCollection.length) i = 0;

        if (slideshow.Cancel) {
            slideshow.CurrentSlideIndex = ++i;
            return;
        }
        
        let slide = slideshow.SlideCollection[i];

        slideshow.CurrentSlideIndex = i;
        
        slide.Animation1Complete = false;
        slide.Animation1Callback = slide.Animation2;
        slide.Element.style.display = "block";
        slide.Element.style.opacity = 1;
        if (slide.TextHolder) slide.TextHolder.style.margin = "0px auto";
        
        slide.Animation1();

        slide.Animation1Complete = true;

        slide.Animation2Callback = function () {

            if (slide.Element && slide.TextHolder) {
                slide.Element.style.display = "none";
                slide.Element.style.opacity = 0;
                slide.TextHolder.style.margin = "0px auto";
                slide.TextHolder.style.fontSize = "3em";
            }

            Slideshow.LoopSlideshow(slideshow, ++i);
        };


    }


    /**
     * Create the play/pause button for the slideshow. 
     */
    CreateControls() 
    {

        var div = document.createElement("div");         
        div.classList.add("ss_controls");
        div.classList.add("pause");
        div.dataset.toggle = "playing";
        div.addEventListener("click", this.TogglePlay); 
        
        this.Container.after(div); 

    }

    /**
     * Hanldes the play/pause button click event. 
     * @param {PointerEvent} event 
     */
    TogglePlay = (event) => 
    {
        var target = event.target; 

        if (target.dataset.toggle == "playing") 
        {
            target.dataset.toggle = "paused"; 
            this.#cancel = true; 
            target.classList.remove("pause");
            target.classList.add("play");

        }
        else 
        {
            target.dataset.toggle = "playing"; 
            this.#cancel = false; 
            target.classList.remove("play");
            target.classList.add("pause");
            Slideshow.LoopSlideshow(this, this.#currentSlideIndex);
        }        
    }

    ///**
    // * The FadeIn Recursive function! 
    // * @param {*} i //integer; the seed used to generate the opacity of the slide. 
    // * @param {*} j //integer; tells us which slide we're on. 
    // * @returns 
    // */
    //FadeIn(i, j) 
    //{   
                
    //    var paddingTop = ((i * 3) + 10) + "px"; 
    //    var paddingRight = (i + 2) + "px"; 
    //    var opacity = i / 100; 
    //    var slide = this.#slideElements[j];        

    //    this.#currentStep =  i;
    //    this.#currentSlideIndex = j;
                
    //    if (this.#cancel) return; 

    //    if (i >= 100){                                   
    //        //console.log(this.#container.id + " slide #" + j);
    //        window.setTimeout(() => {
    //            this.FadeOut(i, j);                            
    //            return;        
    //        }, this.#pauseDuration);
            
    //        return;
    //    }
        
    //    slide.classList.add("show");
    //    slide.style.opacity = opacity;    

    //    if (this.#moveImages){
    //        slide.style.paddingTop = paddingTop;      
    //        //slide.style.paddingRight = paddingRight;       
    //    }
        
    //    window.setTimeout(() => {            
    //        i++;
    //        this.FadeIn(i, j); 
    //        return; 
    //    }, this.#animationDuration);

    //    return;
    //}
    
    ///**
    // * The FadeOut Recursive Function! :-) 
    // * @param {*} i //integer; the seed used to generate the opacity of the slide. 
    // * @param {*} j //integer; tells us which slide we're fading. 
    // * @returns 
    // */
    //FadeOut(i, j) 
    //{                            

    //    this.#currentStep =  i;
    //    this.#currentSlideIndex = j;

    //    if (this.#cancel) return;

    //    var opacity = i / 100; 
    //    var slide = this.#slideElements[j];         

    //    if (i <= 0) 
    //    {        
    //        slide.classList.remove("show");            
    //        j++;
    //        j = this.#slideElements.length > j ? j : 0; 
    //        this.FadeIn(i, j);  
    //        return;                   
    //    }
        
    //    slide.style.opacity = opacity;
        

    //    window.setTimeout(() => {                
    //        i--;
    //        this.FadeOut(i, j); 
    //        return;
    //    }, this.#animationDuration);
        
    //    return;
    //}

    /**
     * Thanks csharptest.net & Code_Worm
     * 
     * https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
     * https://stackoverflow.com/users/164392/csharptest-net
     * https://stackoverflow.com/users/3917465/code-worm     
     * 
     * */
    static #MakeId() {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }


}





/**
 * 
 * The Slide class is used in the Slideshow class. 
 * 
 * A slide is a JS object used to create or interact with the top level child element(s) 
 * of the slideshow container element. 
 * 
 */
class Slide 
{
    #id = ""; 
    #element = null;
    #textHolder = null;
    #textContent = "";
    #textColor = "#000";
    #cssClass = "slide";
    #imageUrl = "";
    #imagePosition = "center";
    #imageSize = "cover";     
    #height = "300px";
    #width = "800px";
    #animation1 = null;
    #animation2 = null; 
    #animation1Delay = 3000;
    #animation2Delay = 0; 
    #animationDuration = 2000;
    #animation1Callback = null;
    #animation2Callback = null;
    #animation1Complete = false;
    #animation2Complete = false;
    #parentSlideshow = null; 

    get Id() { return this.#id; }
    set Id(v) {
        this.#element.id = v;
        this.#id = v; 
    }

    /* The Html Element */     
    get Element() { return this.#element; }
    set Element(v) { this.#element = v; }

    get Height() { return this.#height; }
    set Height(v)
    {
        this.#element.style.height = v;
        this.#height = v;
    }

    get Width() { return this.#width; }
    set Width(v)
    {
        this.#element.style.width = v;
        this.#width = v; 
    }

    /* The background image of the Slide Element */
    get ImageUrl()
    {        
        return this.#imageUrl;
    }
    set ImageUrl(v)
    {
        this.#element.style.background = v;
        this.#imageUrl = v;
    }


    /* The parent element of text in the slide. */
    get TextHolder()
    {
        this.#textHolder = this.#element.getElementsByTagName("span")[0];
        return this.#textHolder;
    }
    //set TextHolder(v)
    //{
    //    this.#textHolder = v;
    //}

    /* The text content of the text holder in the slide */
    get TextContent()
    {
        this.#textContent = this.#textHolder.innerHTML;
        return this.#textContent;
    }
    set TextContent(v)
    {
        this.#textHolder.innerHTML = v; 
        this.#textContent = v;
    }

    get CssClass()
    {
        for (let i = 0; i < this.#element.classList.length; i++)
        {
            this.#cssClass += this.#element.classList[i] + " "; 
        }
        return this.#cssClass;
    }
    set CssClass(v)
    {
        this.#cssClass = v;
                
        let classes = v.split(" ");
        for (let i = 0; i < classes.length; i++) {
            let _class = classes[i];
            this.#element.classList.add(_class);
        }                    

    }

    get ImagePosition() { return this.#imagePosition; }
    set ImagePosition(v)
    {
        this.#element.style.backgroundPosition = v; 
        this.#imagePosition = v;
    }

    get ImageSize() { return this.#imageSize; }
    set ImageSize(v) { this.#imageSize = v; } 

    get TextColor() { return this.#textColor; }
    set TextColor(v) {
        this.#textHolder.style.color = v; 
        this.#textColor = v;
    }

    get Animation1() { return this.#animation1; }
    set Animation1(v) { this.#animation1 = v; }

    get Animation2() { return this.#animation2; }
    set Animation2(v) { this.#animation2 = v; }

    get AnimationDuration() { return this.#animationDuration; }
    set AnimationDuration(v) { this.#animationDuration = v; }

    get Animation1Callback() { return this.#animation1Callback; }
    set Animation1Callback(v) { this.#animation1Callback = v; }

    get Animation2Callback() { return this.#animation2Callback; }
    set Animation2Callback(v) { this.#animation2Callback = v; }

    get Animation1Delay() { return this.#animation1Delay; }
    set Animation1Delay(v) { this.#animation1Delay = v; }

    get Animation1Complete() { return this.#animation1Complete; }
    set Animation1Complete(v) { this.#animation1Complete = v; }

    get Animation2Complete() { return this.#animation2Complete; }
    set Animation2Complete(v) { this.#animation2Complete = v; }

    get ParentSlideshow() { return this.#parentSlideshow; }
    set ParentSlideshow(v) { this.#parentSlideshow = v; }



    /**
     * The Slide Constructor FUNction! 
     * @param {String} src //The background image Url string (optional).
     * @param {String} content //The text content of the slide (optional).
     * @param {String} css //A string containing the desired CSS classes for the slide (separted by a space) (optional).
     * @param {*} pos //The CSS image position of the background image of the slide (optional).
     * @param {*} size //The CSS image size of the slide (optional).
     * @param {*} href //The link of the page to navigate to when the slide is clicked (optional). 
     * @param {*} txtColor //The color of the text content of the slide (optional). 
     * @param {*} dimensions // object containing css-like height and width values. 
     */
    constructor(src, content, css, pos, size, href, txtColor, dimensions)
    {
        
        this.#element = document.createElement("div");        
        this.#textHolder = document.createElement("span");
            
        if (content) {
            this.#textContent = content;    
            this.#textHolder.innerHTML = content;                                  
        }      

        if (pos) {
            this.#imagePosition = pos;            
        }

        if (size) {
            this.#imageSize = size; 
        }

        if (css) {            

            if (Array.isArray(css)) {
                this.#element.classList = css;
            }
            else {


                this.#cssClass = css;

                let classes = css.split(' ');

                for (var key in classes) {
                    this.#element.classList.add(classes[key]);
                }
            }
        }     
                
        if (src) { 
            this.#imageUrl = src;                                     
        }

        if (href) {
            this.#element.addEventListener("click", function(){
                window.location = href; 
            }); 
        }        

        if (txtColor) {
            this.#textColor = txtColor; 
            this.#textHolder.style.color = txtColor;
        }

        if (dimensions) {
            this.Width = dimensions.width;
            this.Height = dimensions.height;
        }

        this.#element.classList.add("slide");
        this.#element.appendChild(this.#textHolder);
    }

    Animate(animation) {
        
        switch (animation.toLowerCase()) {
            case "fadein":
                this.#FadeIn();
                break;
            case "fadeout":
                this.#FadeOut();
                break;
            case "slideoutleft":
                this.#SlideOutLeft();
                break;
            case "slideoutright":
                this.#SlideOutRight();
                break;
            case "slideinfromleft":
                this.#SlideInFromLeft();
                break;
            case "slideinfromright":
                this.#SlideInFromRight();
                break;
        }

    }


    FadeIn = (sender) => {
        return this.#FadeIn();
    }

    FadeOut = (sender) => {
        return this.#FadeOut();
    }

    SlideOutLeft = (sender) => {
        return this.#SlideOutLeft();
    }

    SlideOutRight = (sender) => {
        return this.#SlideOutRight();
    }

    SlideInFromRight = (sender) => {
        return this.#SlideInFromRight();
    }

    SlideInFromLeft = (sender) => {
        return this.#SlideInFromLeft();
    }



    #FadeIn() {

        if (!this.#animationDuration) this.#animationDuration = 2000;        
        if (!this.#animation1Delay) this.#animation1Delay = 3000;

        let el = this.#element;
        el.style.opacity = 0;
        el.style.display = "block";

        let frames = {
            opacity: [0, 1],
            easing: "ease-in-out"
        };

        let effect = new KeyframeEffect(el, frames, this.#animationDuration);         

        let animation = new Animation(effect, document.timeline);
       
        let callback = this.#animation1Callback;
        let delay = this.#animation1Delay;

        if (this.#animation1Complete) {
            callback = this.#animation2Callback;
            delay = this.#animation2Delay;
        }

        animation.onfinish = function () {            
            el.style.display = "block";
            el.style.opacity = 1; 

            if (callback) {
                window.setTimeout(callback, delay);
            }
        };

        animation.play();

        if (this.#parentSlideshow.Cancel) animation.pause();

        return animation; 

    }

    #FadeOut() {        
        
        if (!this.#animationDuration) this.#animationDuration = 2000;
        if (!this.#animation1Delay) this.#animation1Delay = 0; 

        let el = this.#element;
        el.style.opacity = 1;
        el.style.display = "block";

        let frames = {
            opacity: [1, 0],
            easing: "ease-in-out"
        };

        let effect = new KeyframeEffect(el, frames, this.#animationDuration);

        let animation = new Animation(effect, document.timeline);        

        let callback = this.#animation1Callback;
        let delay = this.#animation1Delay;

        if (this.#animation1Complete) {
            callback = this.#animation2Callback;
            delay = this.#animation2Delay;
        }

        animation.onfinish = function () {            
            el.style.display = "none";
            el.style.opacity = 0;
           

            if (callback) {
                window.setTimeout(callback, delay);
            }
          
        };

        animation.play();

        if (this.#parentSlideshow.Cancel) animation.pause();

        return animation; 

    }

       



    #SlideOutLeft()
    {
        if (!this.#animationDuration) this.#animationDuration = 2000;
        if (!this.#animation1Delay) this.#animation1Delay = 0;

        let el = this.#element;
        el.style.opacity = 1; 
        el.style.display = "block";
        //el.style.position = "absolute";

        ////let frames = [
        ////    { right: "1%", position: "absolute", width: el.offsetWidth + "px", height: el.offsetHeight + "px" },
        ////    { right: "100%", position: "absolute", width: el.offsetWidth + "px", height: el.offsetHeight + "px" }
        ////];

        let frames = {
            right: ["1%", "100%"],
            position: ["absolute", "absolute"],
            width: [el.offsetWidth + "px", el.offsetWidth + "px"],
            height: [el.offsetHeight + "px", el.offsetHeight + "px"]
        };

        let timing = {
            duration: this.#animationDuration,
            iterations: 1
        };

        let effect = new KeyframeEffect(el, frames, timing);

        let animation = new Animation(effect, document.timeline);
       
        let callback = this.#animation1Callback;
        let delay = this.#animation1Delay;

        if (this.#animation1Complete) {
            callback = this.#animation2Callback;
            delay = this.#animation2Delay;
        }

        document.body.style.width = document.body.offsetWidth + "px";
        document.body.style.overflowX = "hidden";

        animation.onfinish = function () {            
            el.style.display = "none";
            el.style.opacity = 0; 
            document.body.removeAttribute("style");

            if (callback) {
                window.setTimeout(callback, delay);
            }
        };

        animation.play();

        if (this.#parentSlideshow.Cancel) animation.pause();

        return animation; 

    }

    #SlideOutRight()
    {
        if (!this.#animationDuration) this.#animationDuration = 2000;
        if (!this.#animation1Delay) this.#animation1Delay = 0;

        let el = this.#element;
        el.style.opacity = 1;
        el.style.display = "block";

        let frames = {
            left: ["1%", "100%"],
            position: ["absolute", "absolute"],
            width: [el.offsetWidth + "px", el.offsetWidth + "px"],
            height: [el.offsetHeight + "px", el.offsetHeight + "px"]
        };

        let timing = {
            duration: this.#animationDuration,
            iterations: 1
        };

        let effect = new KeyframeEffect(el, frames, timing);

        let animation = new Animation(effect, document.timeline);

        let callback = this.#animation1Callback;
        let delay = this.#animation1Delay;

        if (this.#animation1Complete) {
            callback = this.#animation2Callback;
            delay = this.#animation2Delay;
        }

        document.body.style.width = document.body.offsetWidth + "px";
        document.body.style.overflowX = "hidden";

        animation.onfinish = function () {                        
            el.style.display = "none";
            el.style.opacity = 0;

            document.body.removeAttribute("style");

            if (callback) {
                window.setTimeout(callback, delay);
            }

        };

        animation.play();

        if (this.#parentSlideshow.Cancel) animation.pause();

        return animation;
    }



    #SlideInFromLeft() {
        if (!this.#animationDuration) this.#animationDuration = 2000;
        if (!this.#animation1Delay) this.#animation1Delay = 3000;

        let el = this.#element;
        el.style.opacity = 1;
        el.style.display = "block";

        //let frames = [
        //    { right: "100%", position: "absolute", width: el.offsetWidth + "px", height: el.offsetHeight + "px" },
        //    { right: "0px", position: "absolute", width: el.offsetWidth + "px", height: el.offsetHeight + "px" }
        //];


        let frames = {
            right: ["100%", "0%"],
            position: ["absolute", "absolute"],
            width: [el.offsetWidth + "px", el.offsetWidth + "px"],
            height: [el.offsetHeight + "px", el.offsetHeight + "px"]
        };

        let timing = {
            duration: this.#animationDuration,
            iterations: 1
        };

        let effect = new KeyframeEffect(el, frames, timing);

        let animation = new Animation(effect, document.timeline);

        let callback = this.#animation1Callback;
        let delay = this.#animation1Delay;

        if (this.#animation1Complete) {
            callback = this.#animation2Callback;
            delay = this.#animation2Delay;
        }

        document.body.style.width = document.body.offsetWidth + "px";
        document.body.style.overflowX = "hidden";

        animation.onfinish = function () {
            el.style.display = "block";
            el.style.opacity = 1;
            document.body.removeAttribute("style");
            if (callback) {
                window.setTimeout(callback, delay);
            }
        };        

        animation.play();

        if (this.#parentSlideshow.Cancel) animation.pause();

        return animation; 

    }

    #SlideInFromRight() {
        if (!this.#animationDuration) this.#animationDuration = 2000;
        if (!this.#animation1Delay) this.#animation1Delay = 3000;

        let el = this.#element;
        el.style.opacity = 1;
        el.style.display = "block";
        //el.style.width = el.offsetWidth;
        //el.style.height = el.offsetHeight;

        //let frames = [
        //    { left: "100%", position: "absolute", width: el.offsetWidth + "px", height: el.offsetHeight + "px" },
        //    { left: "0px", position: "absolute", width: el.offsetWidth + "px", height: el.offsetHeight + "px" }
        //];

        let frames = {
            left: ["100%", "0%"],
            position: ["absolute", "absolute"],
            width: [el.offsetWidth + "px", el.offsetWidth + "px"],
            height: [el.offsetHeight + "px", el.offsetHeight + "px"]
        };

        let timing = {
            duration: this.#animationDuration,
            iterations: 1
        };

        let effect = new KeyframeEffect(el, frames, timing);

        let animation = new Animation(effect, document.timeline);

        let callback = this.#animation1Callback;
        let delay = this.#animation1Delay;

        if (this.#animation1Complete) {
            callback = this.#animation2Callback;
            delay = this.#animation2Delay;
        }

        document.body.style.width = document.body.offsetWidth + "px"; 
        document.body.style.overflowX = "hidden";

        animation.onfinish = function () {
            el.style.display = "block";
            el.style.opacity = 1;
            document.body.removeAttribute("style"); 
            if (callback) {
                window.setTimeout(callback, delay);
            }
        };

        animation.play();

        if (this.#parentSlideshow.Cancel) animation.pause();

        return animation; 
    }


    MoveText(top, left, size, _easing) {

        if (!this.#textHolder) return; 

        let el = this.#textHolder;
        el.style.position = "absolute";
                
        let frames = {            
            marginTop: [top.from, top.to],
            fontSize: [size.from, size.to],
        };

        let timing = {
            duration: this.#animationDuration,
            iterations: 1
        };

        let effect = new KeyframeEffect(el, frames, timing);

        let animation = new Animation(effect, document.timeline);

        animation.onfinish = function () {
            el.style.marginTop = top.to;
            el.style.fontSize = size.to;            
        }

        animation.play();

        if (this.#parentSlideshow.Cancel) animation.pause();
    }

    MoveImage(from, to) {

        let el = this.#element;

        if (!from) start = "auto 80%";
        if (!to) end = "auto 100%";

        let frames = {            
            backgroundSize: [from, to]
        };

        let timing = {
            duration: this.#animationDuration,
            iterations: 1
        };

        let effect = new KeyframeEffect(el, frames, timing);

        let animation = new Animation(effect);

        animation.onfinish = () => {
            this.#element.style.backgroundSize = to; 
        }

        animation.play();

        if (this.#parentSlideshow.Cancel) animation.pause();

    }


}


let ss_make_sytles = function() {

    let styles = document.createElement("link");
    styles.href = "https://hambone-the-great.github.io/JS_Slideshow/slideshow.css";
    styles.setAttribute("rel", "stylesheet");
    styles.type = "text/css";
    document.head.appendChild(styles); 

}();
