package Tarea;

import java.util.ArrayList;

import Histograms.DotPlot;
import Histograms.SparkLine;

public class HistogramCollection {
	
	private ArrayList<Histogram> histogramClases;
	
	public HistogramCollection(){
		histogramClases = new ArrayList<Histogram>();
		Histogram sparkLine = new SparkLine();
		histogramClases.add( sparkLine );
		Histogram dotPlot = new DotPlot();
		histogramClases.add( dotPlot );
	}

	public Histogram getHistogram(String histogramType, String histogramData) {
		histogramClases.get( Integer.parseInt(histogramType)-1 ).setData(histogramData);
		return histogramClases.get( Integer.parseInt(histogramType)-1 );
	}
}
