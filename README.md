
# Frontend challenge

## Main goal of the challenge was to make a clean robust app, that includes features such as:

-   [x] Use the Unsplash API.
-   [x] Make a grid gallery using images from the Unsplash API.
-   [x] Infinite scrolling using lazy load technique to fetch more images.
-   [x] A fullscreen view of said gallery.
-   [x] Fullscreen view should have navigation without closing it.
-   [x] And of course the app should be responsive.

## There were some tech requirements, unfortunately I had to skip some as it would take too long learning and using them properly.

-   [x] React.
-   [x] CSSinJS - I used Styled Components.
-   [ ] Tests (The preferred choice would have been Jest).
-   [ ] Linter - Not entirely sure how I did on this one, but I use the ESLint extension in VS Code and then format using Prettier.

## Choices and reasonings
### Libraries etc
Choice | Reasoning
------------ | -------------
Styled Components | This is nowadays my goto when it comes to CSS in React apps. I could go on and on about the pros of this library, it's simply amazing.
React-cool-onclickoutside | It's usually annoying doing this logic by yourself, that is checking if you clicked outside an element. This library is very small, and fast and easy to use.
JS-file-download | Nice small library for downloading contents. In this case I used it for downloading the original images from Unsplash.
DayJS | I'm sure you've heard of, and probably even used, this library yourselves. It's one of the biggest and best new date/time libraries out there. I could have avoided using it, but I think the tradeoff of using the library is worth the little extra bundle size in this case.
MDI (Material Design Icons)| SVG/PNG icons database that has support for React components. I prefer to use this library when I want SVG icons in my projects. It's open source and already has a huge database of icons. Sometimes I do have to go outside this database for some niche icons, but for general use this library does the job.
React Query | A very robust React custom hook. It has virtually everything you'd want in a HTTP request. Unfortunately it made my architechture a bit awkward as every result is put into its own array, so I decided to merge all those into one single array to handle navigating to previous/next image easier. If the library has a way to fix this, I haven't been able to find that out yet.

And as mentioned, I would have tried to include the Prettier/ESLint requirements if I either had more experience with them or if there was more time.

## Deploy

The app is deployed on my personal VPS at https://unsplash.angelin.dev.
I bundled the app using CRA's `npm run build` script.

# License

This project is licensed under MIT. Feel free to use it anyway you see fit.
