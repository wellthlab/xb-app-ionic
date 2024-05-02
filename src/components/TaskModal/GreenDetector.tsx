import Strings from '../../utils/string_dict.js';
import React from 'react';
import { Button, Typography, TextField, Grid, TextFieldProps } from '@mui/joy';
import { Camera as CameraIcon } from 'phosphor-react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Stack } from '@mui/system';

type Colour = [number, number, number];

const deltaE = function (rgbA: Colour, rgbB: Colour) {
    const labA = rgb2lab(rgbA);
    const labB = rgb2lab(rgbB);

    const deltaL = labA[0] - labB[0];
    const deltaA = labA[1] - labB[1];
    const deltaB = labA[2] - labB[2];

    const c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
    const c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
    const deltaC = c1 - c2;

    let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);

    const sc = 1.0 + 0.045 * c1;
    const sh = 1.0 + 0.015 * c1;
    const deltaLKlsl = deltaL / 1.0;
    const deltaCkcsc = deltaC / sc;
    const deltaHkhsh = deltaH / sh;

    const i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
    return i < 0 ? 0 : Math.sqrt(i);
};

const rgb2lab = function (rgb: Colour) {
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;
    let x;
    let y;
    let z;

    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
};

interface IDetectorInputProps extends Omit<TextFieldProps, 'required' | 'label' | 'helperText' | 'onChange'> {
    onChange: (value: string) => void;
}

interface IGreenDetectorProps {
    required?: boolean;
    greenInputProps: IDetectorInputProps;
    redInputProps: IDetectorInputProps;
}

const GreenDetector = function ({ required, greenInputProps, redInputProps }: IGreenDetectorProps) {
    const [photoUploaded, setPhotoUploaded] = React.useState(false);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const handleTakePhoto = async function () {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Prompt,
            saveToGallery: true,
            quality: 100,
        });

        setPhotoUploaded(true);

        const image = new Image();
        image.onload = function () {
            if (!canvasRef.current) {
                return;
            }

            const imageWidth = canvasRef.current.width;
            const imageHeight = (imageWidth / image.width) * image.height;

            canvasRef.current.height = imageHeight;

            const ctx = canvasRef.current.getContext('2d')!;
            ctx.drawImage(image, 0, 0, imageWidth, imageHeight);

            const data = ctx.getImageData(0, 0, imageWidth, imageHeight);

            let totalPixels = 0;
            let redPixels = 0;
            let greenPixels = 0;

            for (let i = 0; i < data.data.length; i += 4) {
                totalPixels++;
                const rgb = [data.data[i], data.data[i + 1], data.data[i + 2]] as Colour;
                const redDelta = deltaE(rgb, [255, 0, 0]);

                if (redDelta >= 2 && redDelta <= 49) {
                    redPixels++;

                    data.data[i] = 219;
                    data.data[i + 1] = 112;
                    data.data[i + 2] = 139;
                    continue;
                }

                const greenDelta = deltaE(rgb, [0, 255, 0]);
                if (greenDelta >= 2 && greenDelta <= 49) {
                    greenPixels++;

                    data.data[i] = 112;
                    data.data[i + 1] = 219;
                    data.data[i + 2] = 140;
                    continue;
                }
            }

            console.log({ totalPixels, greenPixels, redPixels });
            ctx.putImageData(data, 0, 0);

            greenInputProps.onChange(((greenPixels / totalPixels) * 100).toPrecision(3));
            redInputProps.onChange(((redPixels / totalPixels) * 100).toPrecision(3));
        };

        image.src = photo.webPath!;
    };

    const createHandleChangeDetectorValues = function (onChange: (value: string) => void) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
        };
    };

    return (
        <Stack spacing={2}>
            <Button startDecorator={<CameraIcon />} onClick={handleTakePhoto}>
                {photoUploaded ? Strings.retake_another_picture : Strings.take_a_picture}
            </Button>

            <Typography level="body3">
                {photoUploaded
                    ? Strings.please_review_the_estimation
                    : Strings.a_good_picture_must_show_your}
            </Typography>

            <Grid container spacing={1}>
                <Grid xs={6}>
                    <TextField
                        label={Strings.green}
                        required={required}
                        {...greenInputProps}
                        onChange={createHandleChangeDetectorValues(greenInputProps.onChange)}
                    />
                </Grid>
                <Grid xs={6}>
                    <TextField
                        label={Strings.red}
                        required={required}
                        {...redInputProps}
                        onChange={createHandleChangeDetectorValues(redInputProps.onChange)}
                    />
                </Grid>
            </Grid>

            {photoUploaded && (
                <React.Fragment>
                    <Typography level="body3">
                        {Strings.the_original_picture_has_been}
                    </Typography>

                    <canvas ref={canvasRef}></canvas>
                </React.Fragment>
            )}
        </Stack>
    );
};

export default GreenDetector;
