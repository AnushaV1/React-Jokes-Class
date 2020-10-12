import React from "react";
import axios from "axios";
import JokeClass from "./JokeClass";
import "./JokeList.css";

class JokeList extends React.Component{
    static defaultProps = {
        numJokesToGet: 10
    };
    constructor(props){
        super(props);
        this.state = { jokes: []};
		this.generateNewJokes = this.generateNewJokes.bind(this);
		this.vote = this.vote.bind(this);
    
    }
    componentDidMount() {
        if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
    }
    componentDidUpdate() {
        if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
    }

    async getJokes() {
        let jokes = [...this.state.jokes];
        let seenJokes = new Set(jokes.map((joke) => joke.id));
        try {
            while (jokes.length < this.props.numJokesToGet) {
                let res = await axios.get("https://icanhazdadjoke.com", {
                headers: { Accept: "application/json" }
            });
            let { status, ...jokeObj } = res.data;

            if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            jokes.push({ ...jokeObj, votes: 0 });
            } else {
            console.error("duplicate found!");
            }
            }
            this.setState({ jokes });
        } catch (e) {
        console.log(e);
        }
    }
    
    generateNewJokes() {
        this.setState({ jokes: [] });
    }

    vote(id, delta) {
        this.setState(st => ({
        jokes: st.jokes.map(j =>
            j.id === id ? { ...j, votes: j.votes + delta } : j
        )
        }));
    }

render() {
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    return (
        <div className="JokeList">
        <button className="JokeList-getmore" onClick={this.generateNewJokes}>
        Get New Jokes
        </button>
        {sortedJokes.map(j => (
                <JokeClass text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
        ))}
        {sortedJokes.length < this.props.numJokesToGet ? (
                <div className="loading">
                <i className="fas fa-4x fa-spinner fa-spin" />
                </div>
            ) : null}
        </div>
    )

}
}

export default JokeList;
