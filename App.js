// ********************************************************************************** CARDEDITOR
class CardEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      front: "",
      back: ""
    };
  }

  render() {
    // Render out all cards
    const rows = this.props.cards.map((card, i) => {
      if(card.category === this.props.pickedCategory){
        return (
          <tr key={i}>
            <td>{card.front}</td>
            <td>{card.back}</td>
            <td>
              <button
                className="table__button"
                data-index={i}
                data-id={card._id}
                onClick={this.deleteCard}
              >
                X
              </button>
            </td>
          </tr>
        );
      }
    });

    // Change categories
    const categories = this.props.categories.map(el => {
      return (
        <button
          className={this.props.pickedCategory === el ? "active" : null}
          key={el}
          onClick={() => this.props.handleCategory(el)}
        >
          {el}
        </button>
      )
    });

    return (
      <div className="container">
        <h1>Flashcards</h1>
        <div>
          {categories}
        </div>

        <textarea
          onChange={this.handleChange}
          name="front"
          placeholder="Front of Card"
          value={this.state.front}
        />
        <textarea
          onChange={this.handleChange}
          name="back"
          placeholder="Back of Card"
          value={this.state.back}
        />

        <div className="container__buttons">
          <button 
            onClick={this.addCard}>
            Add Card
          </button>
          <button 
            onClick={this.props.switchMode}>
            Go to Viewer
          </button>
        </div>

        <br />

        <p className="card__info">
          Antal kort {this.props.cards.length}
        </p>

        <table>
          <thead>
            <tr className="tablehead">
              <td>Front</td>
              <td>Back</td>
              <td>Delete</td>
            </tr>
          </thead>
          {rows.length === 0 ? (
            <tbody>
              <tr>
                <td>
                  Lägg till frågor.
                </td>
              </tr>
            </tbody>
          ):(
            <tbody>{rows}</tbody>
          )
          }
        </table>
      </div>
    );
  }

  // ************** Functions

  // Handle textfield change
  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };

  // Add new card
  addCard = () => {
    this.props.addCard(this.state.front, this.state.back, this.props.pickedCategory);
    if(this.state.front.length !== 0 && this.state.back.length !== 0) {
      this.setState({
        front: "",
        back: ""
      });
    }
  };

  // Handle deletecard button
  deleteCard = (event) => {
    this.props.deleteCard(event.target.dataset.index, event.target.dataset.id);
  }
}




// ********************************************************************************** CARDVIEWER
class CardViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      front: true,
      card: 0
    };
    this.prevCard = this.prevCard.bind(this);
    this.nextCard = this.nextCard.bind(this);
  }

  render() {
    return (
      <div className="container">

        <h1>Flashcards</h1>

        <div className="card">
          {
            this.state.front ?
              <div className="card_front">
                <p
                  className="front"
                  onClick={() => this.flipCard()}
                >
                  {this.props.cards[this.state.card].front}
                </p>
              </div>
              :
              <div className="card_back">
                <p
                  className="back"
                  onClick={() => this.flipCard()}
                >
                  {this.props.cards[this.state.card].back}
                </p>
              </div>
          }
        </div>
        <p className="card__info">
          Kort {this.state.card + 1} av {this.props.cards.length}
        </p>
        <div className="buttons">
          <button onClick={this.prevCard} >
            Previous card
          </button>
          <button onClick={this.nextCard} >
            Next card
          </button>
        </div>
        <button onClick={this.props.switchMode}>
          Go to Editor
        </button>
      </div>
    );
  }


  // ************** Functions

  prevCard = () => {
    if (this.state.card === 0) {
      return;
    }
    this.setState({
      card: this.state.card - 1,
      front: true
    });
  }

  nextCard = () => {
    if (this.state.card >= this.props.cards.length - 1) {
      return;
    }
    this.setState({
      card: this.state.card + 1,
      front: true
    });
  }

  flipCard = () => {
    this.setState({
      front: !this.state.front
    });
  }
}




// ********************************************************************************** APP
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: true,
      categories: ['javascript', 'functions'],
      pickedCategory: 'javascript',
      cards: [
      ]
    };
    this.addCard = this.addCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
  }

  componentDidMount() {
    this.loadCards();
  }

  cardFilter(input) {
    return this.state.cards.filter(card => {
      return card.category === input;
    })
  }

  render() {
    if (this.state.editor) {
      return (
        <CardEditor
          deleteCard={this.deleteCard}
          addCard={this.addCard}
          switchMode={this.switchMode}
          cards={this.state.cards}
          categories={this.state.categories}
          pickedCategory={this.state.pickedCategory}
          handleCategory={this.handleCategory}
        />
      );
    } else {
      return (
        <CardViewer
          switchMode={this.switchMode}
          cards={this.cardFilter(this.state.pickedCategory)}
        />
      );
    }
  }


  // Change the category to redirect Storage
  async handleCategory(value) {
    await this.setState({
      pickedCategory: value
    });
    console.log('changed category to ' + this.state.pickedCategory);
  };

  // Load cards
  loadCards() {
    fetch(`/cards`)
      .then((resp) => resp.json())
      .then(cards => cards.reverse())
      .then(cards => this.setState({cards}))
      .catch(err => console.log(err))
  }


  //Change pagemode
  switchMode = () => {
    this.setState(state => ({
      editor: !state.editor
    }));
  };


  // async await to not save storage before state is ready
  // ADD CARD
  async addCard(front, back, category) {
    // check for no empty fields
    if (front.length !== 0 && back.length !== 0) {
      await this.setState(state => ({
        cards: [{ front, back, category }, ...state.cards]
      }));
      
      await fetch(`/cards`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({front, back, category})
      }).then(res => res.json())
        .then(res => console.log(res));

    } else {
      alert('Fyll i båda fälten')
    }
    // Load cards to prevent error 500 when deleting newly created cards
    this.loadCards();
  };



  // DELETE CARD
  async deleteCard(index, id) {
    await this.setState(state => {
      const cards = [...state.cards];
      cards.splice(index, 1);
      return { cards };
    });

    await fetch(`/cards/${id}` , {
      method: 'DELETE'
    }).then(res => res.json())
      .then(res => console.log(res));
  }


}
ReactDOM.render(<App />, document.getElementById('root'));