package tarea;

import tarea.histograms.*;

public class HistogramCollection {
	
	private Histogram	sparkLine, 
						dotPlot,
						superDotPlot,
						stemAndLeaf;
	
	public HistogramCollection(){
		sparkLine = new SparkLine();
		dotPlot = new DotPlot();
		superDotPlot = new SuperDotPlot();
		stemAndLeaf = new StemAndLeaf();
	}

	public Histogram getHistogram(String[] args) {
		
		if( args[0].equals("sparkline") ){
			sparkLine.setData(args);
			return sparkLine;
		}
		if( args[0].equals("dotplot") ){
			dotPlot.setData(args);
			return dotPlot;
		}
		if( args[0].equals("superdotplot") ){
			superDotPlot.setData(args);
			return superDotPlot;
		}
		stemAndLeaf.setData(args);
		return stemAndLeaf;
	}
}
