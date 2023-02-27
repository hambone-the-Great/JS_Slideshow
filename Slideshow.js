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
    #SlideCollection = [];
    #cancel = false; 
    #currentSlide = null; 
    #currentStep = null; 
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
        return this.#SlideCollection;
    }

    set SlideCollection(v) {
        this.#SlideCollection = v; 
    }

    get Cancel(){
        return this.#cancel; 
    }

    set Cancel(v){
        this.#cancel = v; 
    }

    get CurrentStep(){
        return this.#currentStep;
    }

    set CurrentStep(v){
        this.#currentStep = v; 
    }

    get CurrentSlide(){
        return this.#currentSlide;
    }

    set CurrentSlide(v){
        this.#currentSlide = v;
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

    set BackgroundColor(v){
        this.#backgroundColor = v; 
    }

   
    /**
     * The slideshow constructor! :-) Woot! 
     * @param {string} id //The ID of the Slideshow wrapper element. 
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
        
        for (let i = 0; i < this.#slideElements.length; i++) 
        {
            let slide = new Slide(); 
            slide.Element = this.#slideElements[i]; 
            this.#SlideCollection.push(slide);             
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
        this.#SlideCollection.push(slide); 
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

        if (this.#showControls) {
             this.CreateControls();
        }

        if (this.#backgroundColor){
            this.#container.style.backgroundColor = this.#backgroundColor;
        }        

        switch (this.#animationType.toLowerCase())
        {
            case "fade":  
                this.FadeIn(0, this.#startingSlide);
                break;
            case "slide":
                this.SlideLeft(0, this.#startingSlide);
                break;
        }
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
            this.FadeIn(this.#currentStep, this.#currentSlide);
        }        
    }

    /**
     * The FadeIn Recursive function! 
     * @param {*} i //integer; the seed used to generate the opacity of the slide. 
     * @param {*} j //integer; tells us which slide we're on. 
     * @returns 
     */
    FadeIn(i, j) 
    {   
                
        var paddingTop = ((i * 3) + 10) + "px"; 
        var paddingRight = (i + 2) + "px"; 
        var opacity = i / 100; 
        var slide = this.#slideElements[j];        

        this.#currentStep =  i;
        this.#currentSlide = j;
                
        if (this.#cancel) return; 

        if (i >= 100){                                   
            //console.log(this.#container.id + " slide #" + j);
            window.setTimeout(() => {
                this.FadeOut(i, j);                            
                return;        
            }, this.#pauseDuration);
            
            return;
        }
        
        slide.classList.add("show");
        slide.style.opacity = opacity;    

        if (this.#moveImages){
            slide.style.paddingTop = paddingTop;      
            slide.style.paddingRight = paddingRight;       
        }
        
        window.setTimeout(() => {            
            i++;
            this.FadeIn(i, j); 
            return; 
        }, this.#animationDuration);

        return;
    }
    
    /**
     * The FadeOut Recursive Function! :-) 
     * @param {*} i //integer; the seed used to generate the opacity of the slide. 
     * @param {*} j //integer; tells us which slide we're fading. 
     * @returns 
     */
    FadeOut(i, j) 
    {                            

        this.#currentStep =  i;
        this.#currentSlide = j;

        if (this.#cancel) return;

        var opacity = i / 100; 
        var slide = this.#slideElements[j];         

        if (i <= 0) 
        {        
            slide.classList.remove("show");            
            j++;
            j = this.#slideElements.length > j ? j : 0; 
            this.FadeIn(i, j);  
            return;                   
        }
        
        slide.style.opacity = opacity;
        

        window.setTimeout(() => {                
            i--;
            this.FadeOut(i, j); 
            return;
        }, this.#animationDuration);
        
        return;
    }
}





/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * The Slide class is used in the Slideshow class. 
 * 
 * A slide is a JS object used to create or interact with the top level child element(s) 
 * of the slideshow container element. 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
class Slide 
{

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
    #callback = null; 

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
        this.#element.style.backgroundImage = v; 
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
        let classes = v.split(" ");
        for (let i = 0; i < classes.length; i++)
        {
            let _class = classes[i];
            this.#element.classList.add(_class);
        }        
        this.#cssClass = v;
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
    set TextColor(v){ this.#textColor = v; }

    get Callback() { return this.#callback; }
    set Callback(v) { this.#callback = v; }


    /**
     * The Slide Constructor FUNction! 
     * @param {String} src //The background image Url string (optional).
     * @param {String} content //The text content of the slide (optional).
     * @param {String} css //A string containing the desired CSS classes for the slide (separted by a space) (optional).
     * @param {*} pos //The CSS image position of the background image of the slide (optional).
     * @param {*} size //The CSS image size of the slide (optional).
     * @param {*} href //The link of the page to navigate to when the slide is clicked (optional). 
     * @param {*} txtColor //The color of the text content of the slide (optional). 
     */
    constructor(src, content, css, pos, size, href, txtColor, dimensions)
    {
        
        this.#element = document.createElement("div");        
        this.#textHolder = document.createElement("span");


        if (content) {
            this.#textContent = content;                                     
        }      

        if (pos) {
            this.#imagePosition = pos;            
        }

        if (size) {
            this.#imageSize = size; 
        }

        if (css) {            
                        
            this.#cssClass = css; 

            let classes = css.split(' '); 

            for (var key in classes)
            {
                this.#element.classList.add(classes[key]);
            }
        }     
                
        if (src) { 
            this.ImageUrl = src;                                     
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
        
        this.#element.appendChild(this.#textHolder);
    }


    #FadeOut(_opacity, callback) 
    {
        var me = this; 
                             
        if (_opacity <= 0) 
        {
            me.Element.style.opacity = 0; 
            me.Element.style.display = "none";
            if (callback) callback(_opacity);
            return;
        }

        me.Element.style.display = "block";
        _opacity = _opacity - 0.02;
        me.Element.style.opacity = _opacity;

        window.setTimeout(function(){
            me.#FadeOut(_opacity, callback); 
            return;
        }, 75); 

        return;
    }


    #FadeIn(_opacity, callback)
    {

        var me = this;

        if (_opacity >= 1)
        {
            me.Element.style.opacity = 1;
            if (callback) callback(_opacity);
            return;
        }

        me.Element.style.display = "block";
        _opacity = _opacity + 0.02;
        me.Element.style.opacity = _opacity;

        window.setTimeout(function () {
            me.#FadeIn(_opacity, callback);
            return;
        }, 75);

        return; 
    }

    FadeOut = (arg) => {
        this.#FadeOut(1, this.#callback); 
    }

    FadeIn = (arg) => {
        this.#FadeIn(0, this.#callback);
    }



    MoveText(i, t, r, b, l) 
    {
        
    }

    SlideLeft(d)
    {

    }

    SlideRight(d)
    {

    }

    
}
