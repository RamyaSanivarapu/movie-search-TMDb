import React, {Component} from "react";
import AsyncSelect from "react-select/async";
import { Circles }  from  'react-loader-spinner';
import "./index.css";
let numeral = require("numeral");
let backDropIMG;


const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
  }


class MoviePage extends Component{
    constructor(props){
        super(props)
        this.state={
            selectedData:[],
            movieID:157336,
            movieData:{},
            apiStatus: apiStatusConstants.inProgress,
        }
    }

    
    onChange= selectedData =>{
        this.setState({
            selectedData: selectedData || [],
            movieID:selectedData.value,
            apiStatus:apiStatusConstants.inProgress
        })
    }

    componentDidMount(){
        this.getMovieData(this.movieID)
    }

     getResult= async (inputText, callback)=>{
        let apiUrl=`https://api.themoviedb.org/3/search/movie?query=${inputText}&api_key=cfe422613b250f702980a3bbf9e90716`
        const response = await fetch(apiUrl);
        const fetchedData = await response.json()
        const tempArray=[]
        fetchedData.results.forEach((item)=>{
            tempArray.push({movieID:item.id,movieName:item.original_title})
        })
        callback(tempArray.slice(0,5).map(item=>({label:item.movieName, value:item.movieID})))
    }


    getMovieData= async()=>{
        const{movieID}= this.state
        const apiUrl=`https://api.themoviedb.org/3/movie/${movieID}?&api_key=cfe422613b250f702980a3bbf9e90716`;
        const response = await fetch(apiUrl);
        if( response.ok === true){
            const fetchedData = await response.json()
            const updatedData={
                movieID: fetchedData.id,
                originalTitle: fetchedData.original_title.toUpperCase(),
                tagLine: fetchedData.tagline,
                overView: fetchedData.overview,
                homePage: fetchedData.homepage,
                poster: fetchedData.poster_path,
                production: fetchedData.production_companies,
                productionCountries: fetchedData.production_countries,
                genre: fetchedData.genres,
                release: fetchedData.release_date,
                vote: fetchedData.vote_average,
                runTime: fetchedData.runtime,
                revenue: fetchedData.revenue,
                backDrop: fetchedData.backdrop_path
            }
            this.setState({
                movieData : updatedData,
                apiStatus: apiStatusConstants.success,
            })
        }
        if(response.status === 401){
            this.setState({
                apiStatus: apiStatusConstants.failure,
              })
        }     
    }
   
    renderMovieSearch=()=>{
        const {movieData}= this.state
        let posterIMG='https://image.tmdb.org/t/p/w500'+movieData.poster,
            title=movieData.originalTitle,
            production=movieData.production,
            productionList = nestedDataToString(production),
            genre = movieData.genre,
            genresList = nestedDataToString(genre),
            NoData="-",
            date = new Date(movieData.release);
            let releaseDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
            totalRevenue=movieData.revenue;
           backDropIMG = 'https://image.tmdb.org/t/p/original' + movieData.backDrop; 

            if (totalRevenue === 'undefined' || totalRevenue === 0) {
                totalRevenue = NoData
            } else {
                totalRevenue = numeral(movieData.revenue).format('($0,0)');
            };
    
            if (movieData.vote === 'undefined' || movieData.vote === 0) {
                movieData.vote = NoData
            };
    
            if(movieData.poster== null){
                posterIMG = 'https://res.cloudinary.com/ramya44/image/upload/v1655116427/images_uok8sy.jpg';
            }
    
        return(

            <div className="Movie-card">
                    <img  className="poster" src={posterIMG} alt="poster"/>
                <div className="movie-data">
                    <h1 className="title">{title}</h1>
                    <span className="tag">{movieData.tagLine}</span>
                    <p>{movieData.overView}</p>
                    <div className="update">
                        <span className="genre">{genresList}</span><br/>
                        <p>{productionList}</p>
                        <div className="release">
                            <div className="box">
                            <div>Original Release:<br/><span className="data">{releaseDate}</span></div>
                            <div>Box Office:<br/><span className="data">{totalRevenue}</span></div>
                            </div>
                            <div className="box">
                            <div>Vote Average:<br/><span className="data">{movieData.vote} / 10</span></div>
                            <div>Running Time:<br/><span className="data">{movieData.runTime} Mins</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
        }
    componentDidUpdate() {
            document.body.style.backgroundImage = 'url(' + backDropIMG + ')';
            document.body.style.backgroundSize=  "cover";
    }

    renderLoader=()=>(
        <div className="loader">
            <Circles color="#0b69ff" height="80" width="80" />
        </div>
    )

    renderFailureView=()=>{
        <img src="https://image.tmdb.org/t/p/original" alt="File not found"/>
    }

    renderMovieResult=()=>{
        const {apiStatus}= this.state
        switch(apiStatus){
            case apiStatusConstants.success:
                return this.renderMovieSearch()
            case apiStatusConstants.failure:
                return this.renderFailureView()
            case apiStatusConstants.inProgress:
                return this.renderLoader()
            default:
                return null
        }
    }
    
    
    render(){ 
        const {movieID,selectedData}= this.state
        if(selectedData!==""){
            this.getMovieData(movieID)  
        }

        return(
            <div className="app-container">
            <div className="search-container">
                <div className="logo container">
                        <a href="./"
                        title="ReactJS TMDb Movie Search">
                            <img className="logo" 
                            src="https://res.cloudinary.com/ramya44/image/upload/v1655112243/tmdb_hujjum.svg"
                            alt="The Movie Database"/>
                        </a>
                    </div>
                    <div className="search-box">
                    <form id="from">
                                <AsyncSelect 
                                className="search"
                                styles={styleSheet}
                                value={this.state.selectedData}
                                onChange={this.onChange}
                                placeholder={"Search Movie TItle..."}
                                loadOptions={this.getResult}
                                theme={
                                    theme=>({
                                        ...theme,
                                        borderColor: 'black',
                                        colors:{
                                            ...theme.colors,
                                            primary25:"#00FC87",
                                            primary:"white",
                                            neutral0:"#111111",
                                            neutral90:"white",
                                        }
                                    })
                                }
                                />
                        </form>
                    </div>
             </div>
             <div>
                {this.renderMovieResult()}
            </div>
            <footer>
            <span><a href="/" >Designed &amp; developed by Ramya </a> </span>
            <span><a href="/" >View Code</a></span>
            <span><a href="/" >Developer Google Play Store</a></span>
            <span><a href="/" >Developer Apple App Store</a></span>
          </footer>
             </div>
        )
    }
}

function nestedDataToString(nestedData) {
    let nestedArray = [],
        resultString;
    if(nestedData !== undefined){
      nestedData.forEach(function(item){
        nestedArray.push(item.name);
      });
    }
    resultString = nestedArray.join(', '); 
    return resultString;
  };

  const styleSheet = {
    control: base => ({
        ...base,
        border: 0,
        boxShadow: 'none',
        background: "transparent",
        
      }),
    indicatorSeparator:base=>({
        ...base,
        background:"transparent",
      }),
    input:(defaultStyle)=>{
        return{
            ...defaultStyle,
            color:"white"
        }
    },
    singleValue: (provided) => {
        return{
        ...provided,
        color: 'white'
        }
  },
  dropdownIndicator:(defaultStyle)=>{
        return{
            ...defaultStyle,
            color:"transparent"
        }
  },
}



export default MoviePage