chrome.devtools.panels.create("My Panel",
    "logo.png",
    "./devtool/Panel.html",
    function(panel) {
      // code invoked on panel creation
      // console.log(panel);
    }
);

chrome.devtools.panels.elements.createSidebarPane("My Sidebar",
    function(sidebar) {
        // sidebar initialization code here
        // sidebar.setPage("hello.html")
        // sidebar.setObject({ some_data: "Some data to show" });
});