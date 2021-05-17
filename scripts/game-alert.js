class GameAlertPanel
{
    constructor()
    {
        this.panel = document.getElementById("alert_panel");
        this.head  = document.getElementById("alert_box_top");
        this.mid   = document.getElementById("alert_box_mid");
        this.bot   = document.getElementById("alert_box_bot");
    }

    setTitle(title)
    {
        this.head.innerHTML = "";
        this.head.innerHTML = title;
    }

    setBodyElement(element)
    {
        this.mid.innerHTML = "";
        this.mid.appendChild(element);
    }

    setBodyText(txt)
    {
        this.mid.innerHTML = "";
        this.mid.innerHTML = txt;
    }

    addBotElement(element)
    {
        this.bot.innerHTML = "";
        this.bot.appendChild(element);
    }

    setBotText(txt)
    {
        this.bot.innerHTML = "";
        this.bot.innerHTML = txt;
    }

    show()
    {
        this.panel.setAttribute("class", "open");
    }

    hide()
    {
        this.panel.setAttribute("class", "close");
    }

    createButton(id, innerHTML, listener, func)
    {
        let btn = document.createElement("button");
        btn.setAttribute("id", id);
        btn.innerHTML = innerHTML;
        btn.addEventListener(listener, func);
        return btn;
    }

    createCloseButton(id, innerHTML, type, listener)
    {
        let btn = document.createElement("button");
        btn.setAttribute("id", id);
        btn.innerHTML = innerHTML;
        btn.addEventListener("click", this.hide.bind(this));
        btn.addEventListener(type, listener);
        return btn;
    }

}