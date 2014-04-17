package Histograms;

import Tarea.Histogram;
import Processors.SparkLineProcessor;

public class SparkLine extends Histogram {

	public SparkLine(String string) {
		super();
		textData = string;
		histogramProcessor = new SparkLineProcessor(textData);
	}
}
