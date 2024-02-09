# Trig Worms

A pure Javascript application (with HTML and CSS of course!) that creates colourful animated art on an HTML canvas.

No external libraries at all have been used.

Users are in control, in the sense that they can change all sorts of parameters to vary the drawing.

Currently (February 2024) the app is in a nascent state.   There are doubtless many bugs, including some that I am aware of and all of which I intend to fix very soon!

I also have many more features I intend to implement, and will do so soon.

This `README` and the Help text will be expanded considerably in due course, so as to to document the app comprehensively.

In the meantime here are a couple of screenshots:
![](media/tw_00.png)
![](media/tw_01.png)


Do please try it out at <https://teraspora.github.io/trig_worms/>, but don't complain or file issues at this point!   And don't expect it to work on mobile:  that's not a priority at the moment, large screens are the target.   If it crashes your browser, sorry, tough!

## TODO:

- Fix bug where selecting a hidden curve messes the show/hide colours and that messes the active curve
- Fix UI colours not updating properly in some cases    - **DONE!**
- Fix **Github**, **ZU** & **IO** button links          - **DONE!**
- Update **Pause** to **Play** when paused              - **DONE!**
- Curve show/hide styling - put checkboxes on LHS
- Keyboard shortcuts
- Update this `README` with full documentation
- Update Help pane
- Fix `init()` multiplying scenes
- Allow user to vary curve parameters
- Allow user to specify own functions
- Button to remove persistence by calling `clearRect()` every frame     - **DONE!**
- Option to clear to a given opacity    - **DONE, sort of - as trails**
- Bubbles
- Other browsers
- Mobile
- Multiple canvases
- Refactor:
  - Organise inputs better
  - Use web components
- Mutate using shader